<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type"); 

// Include MongoDB library
require '../../vendor/autoload.php';

// Use MongoDB\Client namespace
use MongoDB\Client;

// MongoDB connection
$client = new Client("mongodb://localhost:27017"); 
$database = $client->eCommerce; // Database name
$collection = $database->accounts; // Collection name

// Get email from the query string (e.g., ?email=user@example.com)
$email = isset($_GET['email']) ? $_GET['email'] : '';

// Check if email is provided
if (empty($email)) {
    echo json_encode(['error' => 'Email is required']);
    exit;
}

// Find the user by email
$user = $collection->findOne(['email' => $email]);

if ($user) {
    // If user found, split the name field into firstName and lastName
    $nameParts = explode(" ", $user['name']); // Assuming the name is stored as "First Last"
    $firstName = $nameParts[0] ?? ''; // Default to empty string if no first name
    $lastName = $nameParts[1] ?? '';  // Default to empty string if no last name

    // Return firstName, lastName, and email
    echo json_encode([
        'firstName' => $firstName, 
        'lastName' => $lastName,
        'email' => $user['email']
    ]);
} else {
    // User not found
    echo json_encode(['error' => 'User not found']);
}
?>
