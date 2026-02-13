<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check if latest status file exists
$statusFile = __DIR__ . '/status/latest.json';

if (file_exists($statusFile)) {
    $statusData = json_decode(file_get_contents($statusFile), true);

    // Delete the file after reading
    unlink($statusFile);

    echo json_encode([
        'found' => true,
        'status' => $statusData['status'],
        'message' => $statusData['message'] ?? '',
        'failed_node' => $statusData['failed_node'] ?? ''
    ]);
} else {
    echo json_encode([
        'found' => false
    ]);
}
?>
