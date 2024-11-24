import axios from "axios";

export const readRFID = async (setRfidReadStatus) => {
  try {
    const response = await axios.get("http://192.168.100.220/read-rfid");
    const { status, bookPassID, password, message } = response.data;

    if (status === "success") {
      setRfidReadStatus(`BookPassID: ${bookPassID}, Password: ${password}`);
    } else {
      setRfidReadStatus(message || "No RFID data found");
    }
  } catch (error) {
    console.error("Error reading RFID data:", error);
    setRfidReadStatus("Error reading RFID data");
  }
};
