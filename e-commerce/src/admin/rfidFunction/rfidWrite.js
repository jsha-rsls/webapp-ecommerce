// rfidWrite.js
import axios from 'axios';

// Function to handle saving the data to the RFID card
export const writeRFID = async (formData) => {
  try {
    // First, check if the RFID UID is already registered in the database
    const checkResponse = await axios.post('http://localhost:8000/checkRfid.php', { rfid: formData.rfid }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (checkResponse.data.status === 'exists') {
      return 'This RFID card is already registered. Please use another one.';
    }

    // If RFID is not registered, proceed with writing data to the RFID card
    const writeResponse = await axios.post('http://192.168.100.220/register', formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Handle success
    if (writeResponse.data.status === 'success') {
      return 'Data successfully saved to RFID card!';
    } else {
      return 'Failed to save data to RFID card.';
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return 'Error communicating with the backend.';
  }
};
