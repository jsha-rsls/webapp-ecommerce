/* 
Hardware:
- ESP32 Dev Module
- RFID RC522 Module
- RFID CARDS OR TAGS

Install the following libraries:
- MFRC522 by GitHub Community
- ArduinoJson by Benoit Blanchon
- AsyncTCP by dvarrel
- ESP Async WebServer by Me-No-Dev

Unsolved issue:
- Kapag nakapag write or read na ng rfid card from web, nag eend process sya
- Nasa logic lang ng void loop, para continiously checking if RFID card is detected

#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

// Wi-Fi credentials
const char* ssid = "<WIFI SSID>";
const char* password = "<WIFI PASSWORD>";

// RFID pins
#define SS_PIN 5
#define RST_PIN 2

// Create instances for RFID and HTTP server
MFRC522 mfrc522(SS_PIN, RST_PIN);
AsyncWebServer server(80);  // HTTP server on port 80

// Store the RFID status
String rfidStatus = "Not Detected";

  // Function to read data from RFID block with authentication
  String readDataFromBlock(byte blockAddr) {
    byte buffer[18];  // Buffer to store data (16 bytes + 2 bytes CRC)
    byte size = sizeof(buffer);

    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) {
      key.keyByte[i] = 0xFF;  // Default key
    }

    Serial.println("Attempting to read from block " + String(blockAddr));

    // Authenticate before reading
    if (authenticateBlock(blockAddr, key)) {
      // Read the data from the block if authentication is successful
      if (mfrc522.MIFARE_Read(blockAddr, buffer, &size) == MFRC522::STATUS_OK) {
        String data = "";
        for (byte i = 0; i < 16; i++) {
          if (buffer[i] != 0x00) {  // Ignore empty bytes
            data += (char)buffer[i];
          }
        }
        Serial.println("Read data from block " + String(blockAddr) + ": " + data);
        return data;
      } else {
        Serial.println("Failed to read from block " + String(blockAddr));
      }
    }
    return "";
  }

// Helper function to add CORS headers
void addCORSHeaders(AsyncWebServerResponse* response) {
  response->addHeader("Access-Control-Allow-Origin", "*");
  response->addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response->addHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Function to initialize the Wi-Fi
void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());  // Print ESP32 IP address
}

// Function to authenticate a block before writing data
bool authenticateBlock(byte blockAddr, MFRC522::MIFARE_Key key) {
  MFRC522::StatusCode status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print("Authentication failed for block ");
    Serial.println(blockAddr);
    Serial.println(mfrc522.GetStatusCodeName(status));  // Print status code for debugging
    return false;
  }
  Serial.println("Authentication successful for block " + String(blockAddr));
  return true;
}

// Function to write data to a specific block
void writeDataToBlock(byte blockAddr, String dataToWrite) {
  byte buffer[16] = {};  // Reset buffer for each block
  for (int i = 0; i < dataToWrite.length() && i < 16; i++) {
    buffer[i] = dataToWrite[i];  // Fill the buffer with the data
  }

  // Set up the key for authentication (default key)
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;  // Default key (0xFF for MIFARE Classic cards)
  }

  Serial.println("Attempting to write data to block " + String(blockAddr));
  
  // Authenticate and write data to the block
  if (authenticateBlock(blockAddr, key)) {
    MFRC522::StatusCode status = mfrc522.MIFARE_Write(blockAddr, buffer, 16);
    if (status == MFRC522::STATUS_OK) {
      Serial.println("Data written successfully to block " + String(blockAddr));
    } else {
      Serial.println("Failed to write to block " + String(blockAddr));
    }
  } else {
    Serial.println("Authentication failed for block " + String(blockAddr));
  }
}

// Function to handle registration and store BookPassID and Password
void registerBookPass(String bookPassID, String password) {
  // Remove dashes from BookPassID before writing to RFID card
  bookPassID.replace("-", "");
  
  // Write BookPassID to block 4
  writeDataToBlock(4, bookPassID);

  // Write Password to block 5
  writeDataToBlock(5, password);

  Serial.println("BookPassID and Password saved to RFID card.");
}

void setup() {
  Serial.begin(115200);
  SPI.begin();           // Initialize SPI for RFID
  mfrc522.PCD_Init();    // Initialize RFID reader
  connectToWiFi();       // Connect to Wi-Fi

  // Handle RFID status requests
  server.on("/rfid", HTTP_GET, [](AsyncWebServerRequest* request) {
    Serial.println("Received request for RFID status.");
    AsyncWebServerResponse* response = request->beginResponse(200, "application/json", "{\"rfid\": \"" + rfidStatus + "\"}");
    addCORSHeaders(response);
    request->send(response);
  });

  // Handle reading RFID data
  server.on("/read-rfid", HTTP_GET, [](AsyncWebServerRequest* request) {
    Serial.println("Received request to read RFID data.");
    String bookPassID = readDataFromBlock(4);  // Read from block 4
    String password = readDataFromBlock(5);   // Read from block 5

    // Format BookPassID with dashes
    String formattedBookPassID = "";
    if (bookPassID.length() == 9) {
      formattedBookPassID = bookPassID.substring(0, 3) + "-" + bookPassID.substring(3, 6) + "-" + bookPassID.substring(6, 9);
    }

    DynamicJsonDocument doc(1024);
    if (formattedBookPassID != "" && password != "") {
      doc["status"] = "success";
      doc["bookPassID"] = formattedBookPassID;  // Send formatted BookPassID
      doc["password"] = password;
    } else {
      doc["status"] = "error";
      doc["message"] = "No RFID data found";
    }

    String jsonResponse;
    serializeJson(doc, jsonResponse);

    AsyncWebServerResponse* response = request->beginResponse(200, "application/json", jsonResponse);
    addCORSHeaders(response);
    request->send(response);
  });

  // Preflight CORS for `/register`
  server.on("/register", HTTP_OPTIONS, [](AsyncWebServerRequest* request) {
    Serial.println("Received OPTIONS request for /register.");
    AsyncWebServerResponse* response = request->beginResponse(204);  // 204 No Content
    addCORSHeaders(response);
    request->send(response);
  });

  // Handle registration data (POST)
  server.on("/register", HTTP_POST, [](AsyncWebServerRequest* request) {}, nullptr, [](AsyncWebServerRequest* request, uint8_t* data, size_t len, size_t index, size_t total) {
    String body = String((char*)data);
    Serial.println("Received registration data:");
    Serial.println(body);

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);
    if (error) {
      AsyncWebServerResponse* response = request->beginResponse(400, "application/json", "{\"status\":\"error\",\"message\":\"Invalid JSON\"}");
      addCORSHeaders(response);
      request->send(response);
      return;
    }

    // Extract BookPassID and Password
    String bookPassID = doc["bookPassID"];
    String password = doc["password"];

    Serial.println("BookPassID: " + bookPassID);
    Serial.println("Password: " + password);

    // Save to RFID card
    registerBookPass(bookPassID, password);

    String responseMessage = "{\"status\":\"success\",\"message\":\"BookPassID and Password saved\"}";
    AsyncWebServerResponse* response = request->beginResponse(200, "application/json", responseMessage);
    addCORSHeaders(response);
    request->send(response);
  });

  // Start the server
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  // Continuously check for new RFID tags
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String rfidUID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      rfidUID += String(mfrc522.uid.uidByte[i], HEX);
    }
    Serial.println("RFID UID: " + rfidUID);
    rfidStatus = "Card UID: " + rfidUID;
  } else {
    rfidStatus = "No RFID Card Detected";
  }
}


*/