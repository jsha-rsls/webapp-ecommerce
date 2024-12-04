<?php
// connection-to-accounts.php

require '../../vendor/autoload.php';  // Ensure Composer's autoloader is included

use MongoDB\Client;

// MongoDB connection
function getMongoDBCollection() {
    // Connect to MongoDB
    $client = new Client("mongodb://localhost:27017");
    
    // Access the 'eCommerce' database and 'accounts' collection
    $database = $client->eCommerce;  // Database name
    $collection = $database->accounts;  // Collection name
    
    return $collection;  // Return the collection object
}
?>
