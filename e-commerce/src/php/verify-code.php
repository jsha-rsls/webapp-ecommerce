<?php
// Set the content type to JSON
header('Content-Type: application/json');

// Allow Cross-Origin Requests
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Suppress error messages to prevent HTML output
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Include necessary files
require '../../vendor/autoload.php';
include('connection-to-accounts.php');

// Verify the code
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['email'], $input['code'])) {
        $email = $input['email'];
        $code = $input['code'];

        // Validate input
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^\d{6}$/', $code)) {
            echo json_encode(['error' => 'Invalid email or code format']);
            exit;
        }

        // Get MongoDB collection
        $client = new MongoDB\Client("mongodb://localhost:27017"); // Update with your connection string if different
        $collection = $client->eCommerce->verificationCodes;

        // Check if the code matches and is not expired
        $user = $collection->findOne(['email' => $email]);

        if ($user && isset($user['verification_code'], $user['code_expiry'])) {
            if (time() > $user['code_expiry']) {
                echo json_encode(['error' => 'The verification code has expired.']);
                exit;
            }

            if ((string)$user['verification_code'] === $code) {
                echo json_encode(['success' => 'Code verified successfully']);

                // Get current time
                $current_time = time();

                // Optionally clear the code after 5 minutes (300 seconds)
                $collection->updateOne(
                    [
                        'email' => $email,
                        'code_expiry' => ['$lte' => $current_time - 300] // Check if expiry time is more than 5 minutes ago
                    ],
                    [
                        '$unset' => ['verification_code' => "", 'code_expiry' => ""]
                    ]
                );
                exit;
            } else {
                echo json_encode(['error' => 'The verification code is incorrect']);
                exit;
            }
        } else {
            echo json_encode(['error' => 'No verification code found for this email']);
            exit;
        }
    } else {
        echo json_encode(['error' => 'Invalid request: Email or code not provided']);
        exit;
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
