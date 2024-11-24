<?php
header("Access-Control-Allow-Origin: *");  // Allows all domains to access this resource
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");  // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type");  // Allow headers such as Content-Type

// Include MongoDB library
require '../../vendor/autoload.php';  // Ensure Composer's autoloader is included

use MongoDB\Client;

// MongoDB connection
$client = new Client("mongodb://localhost:27017");  // Connect to MongoDB
$database = $client->eCommerce; // Database name

$collection = $database->accounts; // Collection name

// Get email and password from POST request
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Check if email and password are provided
if (empty($email) || empty($password)) {
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

// Find the user by email
$user = $collection->findOne(['email' => $email]);

if ($user) {
    // Verify the password
    if (password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['email'] = $email;

        // Send back the user data with 'name' field instead of 'firstName' and 'lastName'
        unset($user['password']); // Remove password for security
        echo json_encode(['success' => true, 'user' => $user, 'email' => $email, 'name' => $user['name']]);
    } else {
        echo json_encode(['error' => 'Invalid password']);
    }
} else {
    echo json_encode(['error' => 'User not found']);
}
?>
