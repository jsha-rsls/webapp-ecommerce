<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include the MongoDB client library
require '../../vendor/autoload.php'; // Ensure MongoDB PHP library is installed via Composer

use MongoDB\Client;

// MongoDB connection
$client = new Client("mongodb://localhost:27017");
$database = $client->eCommerce; // Database name
$collection = $database->accounts; // Collection name

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Capture form data
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;
    $name = $_POST['name'] ?? null;
    $phone = $_POST['phone'] ?? null;
    $gender = $_POST['gender'] ?? null;
    $dob = $_POST['dob'] ?? null;
    $postalCode = $_POST['postalCode'] ?? null;
    $address = $_POST['address'] ?? null;
    $label = $_POST['label'] ?? null;

    // Validate required fields
    $errors = [];
    if (!$email) $errors[] = "Email is required.";
    if (!$password) $errors[] = "Password is required.";
    if (!$name) $errors[] = "Name is required.";
    if (!$phone) $errors[] = "Phone number is required.";
    if (!$gender) $errors[] = "Gender is required.";
    if (!$dob) $errors[] = "Date of birth is required.";

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }

    // Prepare the document to insert into MongoDB
    $document = [
        'email' => $email,
        'password' => password_hash($password, PASSWORD_BCRYPT), // Secure password storage
        'name' => $name,
        'phone' => $phone,
        'gender' => $gender,
        'dob' => json_decode($dob, true), // Decode JSON date of birth
        'address' => [
            'postalCode' => $postalCode,
            'details' => $address,
            'label' => $label,
        ],
    ];

    // Insert into MongoDB
    try {
        $insertResult = $collection->insertOne($document);
        echo json_encode(['success' => true, 'message' => 'Account created successfully!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
