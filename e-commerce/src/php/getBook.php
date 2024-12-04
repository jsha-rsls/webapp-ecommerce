<?php
// Allow cross-origin requests from the React app
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With'); 
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit;
}

require 'connection-to-books.php';  // Include the connection file for MongoDB
require '../../vendor/autoload.php';  // Include Composer's autoload if using libraries

// Ensure the request is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $booksCollection = getBooksCollection();  // Get the MongoDB collection for books

        // Check if a bookId is provided in the query parameters
        if (isset($_GET['bookId'])) {
            // If bookId is provided, retrieve the specific book
            $bookId = $_GET['bookId'];
            $book = $booksCollection->findOne(['bookId' => $bookId]);

            if ($book) {
                // Return the book details if found
                echo json_encode([
                    'success' => true,
                    'book' => $book  // Return the book data
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Book not found.'
                ]);
            }
        } else {
            // Retrieve all books from the collection if no bookId is provided
            $books = $booksCollection->find();  // MongoDB find method returns a cursor
            
            // Convert the cursor to an array
            $booksArray = iterator_to_array($books);

            // Return the books data as a JSON response
            echo json_encode([
                'success' => true,
                'books' => $booksArray  // Include the books array in the response
            ]);
        }
    } catch (MongoDB\Exception\Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
