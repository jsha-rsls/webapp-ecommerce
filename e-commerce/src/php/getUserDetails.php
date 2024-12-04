<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from all origins (for development)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Allow credentials (if needed)

require '../../vendor/autoload.php'; // MongoDB library
require 'connection-to-accounts.php'; // Database connection

$collection = getMongoDBCollection(); // Retrieve MongoDB collection

// Retrieve email from query parameters
$email = isset($_GET['email']) ? $_GET['email'] : '';

if (empty($email)) {
    echo json_encode(['error' => 'Email is required']);
    exit;
}

// Sanitize email input to prevent injection attacks (even though MongoDB is generally safe)
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// Find the user in the MongoDB collection by email
$user = $collection->findOne(['email' => $email]);

if ($user) {
    // Return the user details
    echo json_encode([
        'username' => $user['username'] ?? 'Guest', // Default to 'Guest' if username is missing
        'email' => $user['email']
    ]);
} else {
    // Handle case where the user does not exist
    echo json_encode(['error' => 'User not found']);
}
?>
