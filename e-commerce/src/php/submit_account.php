<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include MongoDB client library
require '../../vendor/autoload.php'; // Ensure MongoDB PHP library is installed via Composer

// Include MongoDB connection to accounts collection
require 'connection-to-accounts.php';  // Include the connectiontoaccounts.php file

// Get the MongoDB collection
$collection = getMongoDBCollection(); // Get the 'accounts' collection

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Capture form data from both Step 1 and Step 2
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;
    $confirmPassword = $_POST['confirmPassword'] ?? null; // Ensure confirmPassword is captured
    $username = $_POST['username'] ?? null;
    $phone = $_POST['phone'] ?? null;
    $gender = $_POST['gender'] ?? null;
    $dob = isset($_POST['dob']) ? json_decode($_POST['dob'], true) : null;  // Decode the DOB JSON object
    $postalCode = $_POST['postalCode'] ?? null;
    $address = $_POST['address'] ?? null;
    $label = $_POST['label'] ?? null;

    // Step 2: Region, Province, City, Barangay
    $region = $_POST['region'] ?? null;
    $province = $_POST['province'] ?? null;
    $city = $_POST['city'] ?? null;
    $barangay = $_POST['barangay'] ?? null;

    // Validate required fields for Step 1 and Step 2
    $errors = [];

    // Step 1 validations
    if (!$email) $errors[] = "Email is required.";
    if (!$password) $errors[] = "Password is required.";
    if ($password !== $confirmPassword) $errors[] = "Passwords do not match."; // Direct comparison
    if (!$username) $errors[] = "Username is required.";
    if (!$phone) $errors[] = "Phone number is required.";
    if (!$gender) $errors[] = "Gender is required.";
    if (!$dob || !isset($dob['day'], $dob['month'], $dob['year'])) $errors[] = "Date of birth is required and must have day, month, and year.";

    // Step 2 validations
    if (!$postalCode) $errors[] = "Postal code is required.";
    if (!$address) $errors[] = "Address is required.";
    if (!$label) $errors[] = "Label (Home or Work) is required.";
    if (!$region) $errors[] = "Region is required.";
    if (!$province) $errors[] = "Province is required.";
    if (!$city) $errors[] = "City is required.";
    if (!$barangay) $errors[] = "Barangay is required.";

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }

    // Store the password as a hash
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Prepare the document to insert into MongoDB
    $document = [
        'email' => $email,
        'password' => $hashedPassword, // Secure password storage
        'username' => $username,
        'phone' => $phone,
        'gender' => $gender,
        'dob' => $dob, // Store the full DOB object (day, month, year)
        'address' => [
            'postalCode' => $postalCode,
            'details' => $address,
            'label' => $label,
            'region' => $region,
            'province' => $province,
            'city' => $city,
            'barangay' => $barangay
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

?>
