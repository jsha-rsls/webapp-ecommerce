<?php
// Allow cross-origin requests (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include the MongoDB PHP Library
require '../../vendor/autoload.php';

// Connect to MongoDB
$client = new MongoDB\Client("mongodb://localhost:27017");
$collection = $client->eCommerce->bookpass; // Connect to the 'bookpass' collection in the 'eCommerce' database

// Get JSON data from the request
$data = json_decode(file_get_contents("php://input"));

// Check if 'rfid' field is provided
if (isset($data->rfid)) {
    $rfid = $data->rfid;

    // Query the MongoDB collection to check if the RFID exists
    $query = ['rfid' => $rfid];
    $user = $collection->findOne($query);

    if ($user) {
        // RFID already exists in the database
        echo json_encode(['status' => 'exists']);
    } else {
        // RFID does not exist
        echo json_encode(['status' => 'not_exists']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'RFID not provided']);
}
?>
