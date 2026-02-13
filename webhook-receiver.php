<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get the JSON data from n8n
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (!isset($data['status'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing status']);
    exit;
}

$status = $data['status']; // Should be 'success' or 'error'
$message = $data['message'] ?? '';
$failedNode = $data['failed_node'] ?? '';

// Create status directory if it doesn't exist
$statusDir = __DIR__ . '/status';
if (!is_dir($statusDir)) {
    mkdir($statusDir, 0755, true);
}

// Store the latest status in a single file
$statusFile = $statusDir . '/latest.json';
$statusData = [
    'status' => $status,
    'message' => $message,
    'failed_node' => $failedNode,
    'timestamp' => time()
];

file_put_contents($statusFile, json_encode($statusData));

echo json_encode([
    'success' => true,
    'status' => $status
]);
?>
