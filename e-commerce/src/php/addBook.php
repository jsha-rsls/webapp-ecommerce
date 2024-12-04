<?php
// addBook.php

// Allow cross-origin requests from the React app
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin, or replace * with your React app's URL
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Allow POST and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With'); // Allow required headers
header('Content-Type: application/json');

require 'connection-to-books.php';  // Update with the correct path to connection-to-books.php
require '../../vendor/autoload.php';

// Handle preflight requests (OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $booksCollection = getBooksCollection();

        // Handle image upload if provided
        $imagePath = null;
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            $imagePath = $uploadDir . basename($_FILES['image']['name']);
            move_uploaded_file($_FILES['image']['tmp_name'], $imagePath);
        }

        // Collect data from the POST request
        $bookData = [
            'name' => $_POST['name'] ?? '',
            'author' => $_POST['author'] ?? '',
            'ageRecommendation' => $_POST['ageRecommendation'] ?? null,
            'genre' => $_POST['genre'] ?? '',
            'type' => $_POST['type'] ?? '',
            'format' => $_POST['format'] ?? '',
            'language' => $_POST['language'] ?? '',
            'price' => (float) ($_POST['price'] ?? 0),
            'stock' => (int) ($_POST['stock'] ?? 0),
            'image' => $imagePath,
        ];

        // Generate a random 6-digit bookId
        $bookData['bookId'] = str_pad(rand(100000, 999999), 6, '0', STR_PAD_LEFT);

        // Validate required fields
        if (empty($bookData['name']) || empty($bookData['author']) || empty($bookData['price']) || empty($bookData['stock'])) {
            echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
            exit;
        }

        // Insert into the database
        $result = $booksCollection->insertOne($bookData);

        // Check if insertion was successful
        if ($result->getInsertedCount() > 0) {
            echo json_encode([
                'success' => true, 
                'message' => 'Book added successfully!',
                'bookId' => $bookData['bookId'] // Return the bookId in the response
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add the book.']);
        }
    } catch (MongoDB\Exception\Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
