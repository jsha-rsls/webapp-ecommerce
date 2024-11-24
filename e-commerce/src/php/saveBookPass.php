<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the MongoDB PHP Library
require '../../vendor/autoload.php';

// Connect to MongoDB
$client = new MongoDB\Client("mongodb://localhost:27017");
$collection = $client->eCommerce->bookpass; // Connect to the 'bookpass' collection in the 'eCommerce' database

// Get data from the POST request
$data = json_decode(file_get_contents("php://input"), true);

// Validate if the required data exists
if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

// Check if the RFID already exists in the database
$existingRfid = $collection->findOne(['rfid' => $data['rfid']]);

if ($existingRfid) {
    // RFID already exists, return an error message
    echo json_encode([
        "status" => "error",
        "message" => "This RFID CARD is already registered. Please use another one.",
    ]);
    exit();
}

// Prepare the data for insertion
$bookPassData = [
    "bookPassID" => $data['bookPassID'],
    "password" => $data['password'],
    "email" => $data['email'],
    "name" => $data['name'],
    "phone" => $data['phone'],
    "gender" => $data['gender'],
    "dob" => $data['dob'], // Store the complete DOB object
    "address" => $data['address'],
    "postalCode" => $data['postalCode'],
    "label" => $data['label'],
    "rfid" => $data['rfid'], // RFID data
];

// Insert the data into MongoDB
try {
    $insertResult = $collection->insertOne($bookPassData);
    echo json_encode([
        "status" => "success",
        "message" => "Book Pass registered successfully",
        "insertedId" => (string)$insertResult->getInsertedId(),
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error inserting data: " . $e->getMessage(),
    ]);
}
?>
