<?php
// connection-to-books.php

require '../../vendor/autoload.php';

use MongoDB\Client;

// MongoDB connection
function getBooksCollection() {
    $client = new Client("mongodb://localhost:27017");
    
    $database = $client->eCommerce;  // Database name
    $collection = $database->books;  // Collection name
    
    return $collection;
}
?>
