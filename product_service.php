<?php
header('Content-Type: application/json');

$jsonFile = 'products.json';

// Function to read all records
function getAllProducts($file) {
    if (!file_exists($file)) return [];
    $content = file_get_contents($file);
    return json_decode($content, true);
}

// Function to save records
function saveProducts($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $products = getAllProducts($jsonFile);
    
    if (isset($_GET['id'])) {
        // Return specific record one by one
        $id = intval($_GET['id']);
        $product = array_filter($products, function($p) use ($id) {
            return $p['id'] === $id;
        });
        echo json_encode(array_values($product)[0] ?? ['error' => 'Product not found']);
    } else {
        // Return all records at once
        echo json_encode($products);
    }
}

if ($method === 'POST') {
    // Store data records based on POST request
    $products = getAllProducts($jsonFile);
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input) {
        $newProduct = [
            "id" => time(),
            "name" => $input['name'] ?? 'New Product',
            "price" => floatval($input['price'] ?? 0),
            "description" => $input['description'] ?? '',
            "category" => $input['category'] ?? 'General',
            "stock" => intval($input['stock'] ?? 0),
            "rating" => floatval($input['rating'] ?? 0)
        ];
        
        $products[] = $newProduct;
        saveProducts($jsonFile, $products);
        echo json_encode(['success' => true, 'product' => $newProduct]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
    }
}
?>
