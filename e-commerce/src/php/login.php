<?php
header("Access-Control-Allow-Origin: *"); // Allows all domains to access this resource
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow headers such as Content-Type
header("Content-Type: application/json"); // Ensure the response is in JSON format

// Include MongoDB library
require '../../vendor/autoload.php'; // Ensure Composer's autoloader is included

// Include MongoDB connection to accounts collection
require 'connection-to-accounts.php'; // Include the connectiontoaccounts.php file

try {
    // Get the MongoDB collection
    $collection = getMongoDBCollection(); // Get the 'accounts' collection

    // Try a simple query to ensure connection
    $collection->findOne(); // Just a test query to check the connection
} catch (Exception $e) {
    // If the connection fails, return an error response as JSON
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Ensure error messages do not disrupt JSON responses
ini_set('display_errors', 0); // Suppress error display
error_reporting(E_ERROR | E_PARSE); // Limit error reporting to critical issues

// Get email or username and password from POST request
$emailOrUsername = isset($_POST['email']) ? $_POST['email'] : (isset($_POST['username']) ? $_POST['username'] : '');
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (!$emailOrUsername || !$password) {
    // Validate input fields
    echo json_encode(['error' => 'Email/Username and password are required.']);
    exit;
}

try {
    // Find the user by email or username
    $user = $collection->findOne([
        '$or' => [
            ['email' => $emailOrUsername], // Check if the value is an email
            ['username' => $emailOrUsername] // Check if the value is a username
        ]
    ]);

    if ($user) {
        // Verify the password
        if (password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['email'] = $user['email']; // Store email in session for later use

            // Send back the user data without sensitive information
            unset($user['password']); // Remove password for security
            echo json_encode(['success' => true, 'user' => $user, 'email' => $user['email'], 'name' => $user['name']]);
        } else {
            echo json_encode(['error' => 'Invalid password']);
        }
    } else {
        echo json_encode(['error' => 'User not found']);
    }
} catch (Exception $e) {
    // Handle unexpected server-side errors
    echo json_encode(['error' => 'An error occurred while processing the request: ' . $e->getMessage()]);
}
?>
