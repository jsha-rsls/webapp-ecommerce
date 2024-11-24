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

// Validate the input
if (isset($data->bookPassID) && isset($data->password)) {
    $bookPassID = $data->bookPassID;
    $password = $data->password;

    // Query the MongoDB collection to find the user with the provided book pass ID
    $user = $collection->findOne(['bookPassID' => $bookPassID]);

    if ($user && $user['password'] === $password) {
        // Correct credentials (plain-text comparison)
        echo json_encode(['status' => 'success', 'message' => 'Login successful']);
    } else {
        // Incorrect credentials
        echo json_encode(['status' => 'error', 'message' => 'Invalid Book Pass ID or password']);
    }
} else {
    // Missing data
    echo json_encode(['status' => 'error', 'message' => 'Book Pass ID and password are required']);
}
?>
