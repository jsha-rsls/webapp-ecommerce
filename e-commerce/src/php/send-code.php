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
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Step 1: Send Verification Code to Email
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['email'])) {
        $email = $input['email'];

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['error' => 'Invalid email format']);
            exit;
        }

        // Get MongoDB collection
        $client = new MongoDB\Client("mongodb://localhost:27017"); // Update with your connection string if different
        $accountsCollection = $client->eCommerce->accounts; // Access the accounts collection
        $verificationCollection = $client->eCommerce->verificationCodes; // Access the verificationCodes collection

        // Check if the email exists in the database
        $user = $accountsCollection->findOne(['email' => $email]);

        if (!$user) {
            echo json_encode(['error' => 'Email not registered']);
            exit;
        }

        // Generate a 6-digit verification code
        $code = rand(100000, 999999);

        // Store the verification code and expiry in the database
        $expiry = time() + 300; // 5 minutes

        // Upsert the verification code and expiry into the verificationCodes collection
        $result = $verificationCollection->updateOne(
            ['email' => $email], // Find the user by email
            ['$set' => ['verification_code' => $code, 'code_expiry' => $expiry]], // Set verification code and expiry time
            ['upsert' => true] // Create a new document if one does not exist
        );

        // Check if the update was successful
        if ($result->getModifiedCount() === 0 && $result->getUpsertedCount() === 0) {
            echo json_encode(['error' => 'Failed to store verification code']);
            exit;
        }

        // Send the verification code via email using PHPMailer
        $mail = new PHPMailer(true);

        try {
            // SMTP settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'childhoodecommerce@gmail.com'; // Your Gmail address
            $mail->Password = 'qood wfpc naue kxbg'; // Your Gmail app password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Email details
            $mail->setFrom('childhoodecommerce@gmail.com', 'Childhood E-Commerce');
            $mail->addAddress($email); // Add recipient

            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Code';

            // HTML body content with better structure and design
            $mail->Body = '
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f9;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            background-color: #ffffff;
                            border-radius: 8px;
                            padding: 30px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                        }
                        h2 {
                            color: #333;
                            font-size: 24px;
                        }
                        p {
                            font-size: 16px;
                            color: #555;
                        }
                        .code {
                            font-size: 18px;
                            color: #007BFF;
                            font-weight: bold;
                            padding: 8px 12px;
                            border: 1px solid #007BFF;
                            border-radius: 4px;
                        }
                        .footer {
                            font-size: 12px;
                            color: #888;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Password Reset Request</h2>
                        <p>Hi there,</p>
                        <p>You requested a password reset for your account. To proceed, please use the following verification code:</p>
                        <p class="code">' . $code . '</p>
                        <p>If you didn\'t request this, please ignore this email.</p>
                        <p>Thank you for choosing Childhood E-Commerce!</p>
                        <div class="footer">
                            <p>For further assistance, contact our support team at <a href="mailto:support@childhoodecommerce.com">support@childhoodecommerce.com</a>.</p>
                        </div>
                    </div>
                </body>
                </html>
            ';

            $mail->send();

            echo json_encode(['success' => 'Verification code sent successfully']);
        } catch (Exception $e) {
            error_log("Mailer Error: " . $mail->ErrorInfo);
            echo json_encode(['error' => 'Mailer Error: ' . $mail->ErrorInfo]);
        }
    } else {
        echo json_encode(['error' => 'Email not provided']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
