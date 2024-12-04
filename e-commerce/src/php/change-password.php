<?php
// Set the content type to JSON
header('Content-Type: application/json');

// Allow Cross-Origin Requests
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Suppress error messages to prevent HTML output
ini_set('display_errors', 1); // Turn on for debugging
error_reporting(E_ALL);

// Include necessary files
require '../../vendor/autoload.php';
include('connection-to-accounts.php');  // Assuming this includes MongoDB connection
use MongoDB\Client;

// Verify the change password request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if necessary fields are provided
    if (isset($input['email'], $input['code'], $input['newPassword'], $input['confirmPassword'])) {
        $email = $input['email'];
        $code = $input['code'];
        $newPassword = $input['newPassword'];
        $confirmPassword = $input['confirmPassword'];

        // Step 1: Validate inputs
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['error' => 'Invalid email format']);
            exit;
        }

        // Password validation
        if (strlen($newPassword) < 6) {
            echo json_encode(['error' => 'Password must be at least 6 characters']);
            exit;
        }

        if ($newPassword !== $confirmPassword) {
            echo json_encode(['error' => 'Passwords do not match']);
            exit;
        }

        // Step 2: Check the verification code in MongoDB
        $client = new Client("mongodb://localhost:27017");
        $verificationCollection = $client->eCommerce->verificationCodes;

        // Check if the email and code exist
        $userVerification = $verificationCollection->findOne(['email' => $email]);

        if (!$userVerification) {
            echo json_encode(['error' => 'No verification code found for this email']);
            exit;
        }

        // Check if the code has expired
        if (time() > $userVerification['code_expiry']) {
            echo json_encode(['error' => 'The verification code has expired']);
            exit;
        }

        // Verify the code
        if ((string)$userVerification['verification_code'] !== $code) {
            echo json_encode(['error' => 'Incorrect verification code']);
            exit;
        }

        // Step 3: Hash the new password
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

        // Step 4: Update the password in the accounts collection
        $accountsCollection = $client->eCommerce->accounts;

        // Update the password in the accounts collection based on the email
        $updateResult = $accountsCollection->updateOne(
            ['email' => $email],  // Find the user by email
            ['$set' => ['password' => $hashedPassword]]  // Update the password
        );

        // Debugging: Log the update result
        error_log("Update Result: " . json_encode($updateResult));

        // Step 5: Check if the password was successfully updated
        if ($updateResult->getModifiedCount() > 0) {
            // Optionally clear the verification code after successful password change (if you want)
            $verificationCollection->updateOne(
                ['email' => $email],
                ['$unset' => ['verification_code' => "", 'code_expiry' => ""]] // Clear the code after use
            );

            echo json_encode(['success' => 'Password updated successfully']);
        } else {
            // Debugging: Check if the update was successful
            error_log('Update failed: ' . json_encode($updateResult));
            echo json_encode(['error' => 'Failed to update the password. Please try again later.']);
        }
    } else {
        echo json_encode(['error' => 'Missing parameters: email, code, or passwords']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
