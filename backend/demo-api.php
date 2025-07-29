#!/usr/bin/env php
<?php

/**
 * Wedding Website Backend API - Demo Script
 * 
 * This script demonstrates the API endpoints and their expected responses.
 * Run this after setting up the backend to test the API functionality.
 */

$baseUrl = 'http://localhost:8000/api';

// Colors for output
$colors = [
    'green' => "\033[32m",
    'yellow' => "\033[33m",
    'red' => "\033[31m",
    'blue' => "\033[34m",
    'reset' => "\033[0m"
];

function colorize($text, $color) {
    global $colors;
    return $colors[$color] . $text . $colors['reset'];
}

function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $defaultHeaders = [
        'Content-Type: application/json',
        'Accept: application/json',
    ];
    
    $headers = array_merge($defaultHeaders, $headers);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'body' => $response ? json_decode($response, true) : null
    ];
}

echo colorize("🎉 Wedding Website Backend API Demo\n", 'blue');
echo colorize("=====================================\n\n", 'blue');

// Test health endpoint
echo colorize("1. Testing Health Check...\n", 'yellow');
$response = makeRequest($baseUrl . '/health');
if ($response['status'] === 200) {
    echo colorize("✅ Health check passed\n", 'green');
    echo "Response: " . json_encode($response['body'], JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo colorize("❌ Health check failed\n", 'red');
    echo "Status: " . $response['status'] . "\n\n";
}

// Test events endpoint
echo colorize("2. Testing Events API...\n", 'yellow');
$response = makeRequest($baseUrl . '/events');
if ($response['status'] === 200) {
    echo colorize("✅ Events API working\n", 'green');
    if (isset($response['body']['data']) && count($response['body']['data']) > 0) {
        echo "Found " . count($response['body']['data']) . " events\n";
        echo "First event: " . $response['body']['data'][0]['name'] . "\n\n";
    } else {
        echo "No events found (run database seeder first)\n\n";
    }
} else {
    echo colorize("❌ Events API failed\n", 'red');
    echo "Status: " . $response['status'] . "\n\n";
}

// Test multilingual support
echo colorize("3. Testing Multilingual Support...\n", 'yellow');
$response = makeRequest($baseUrl . '/events', 'GET', null, ['Accept-Language: bn']);
if ($response['status'] === 200) {
    echo colorize("✅ Bengali language support working\n", 'green');
    if (isset($response['body']['data']) && count($response['body']['data']) > 0) {
        echo "Bengali event name: " . $response['body']['data'][0]['name'] . "\n\n";
    }
} else {
    echo colorize("❌ Multilingual support failed\n", 'red');
}

// Test content API
echo colorize("4. Testing Content Management API...\n", 'yellow');
$response = makeRequest($baseUrl . '/content/home');
if ($response['status'] === 200) {
    echo colorize("✅ Content API working\n", 'green');
    echo "Home content keys: " . implode(', ', array_keys($response['body']['data']['content'])) . "\n\n";
} else {
    echo colorize("❌ Content API failed\n", 'red');
    echo "Status: " . $response['status'] . "\n\n";
}

// Test gallery API
echo colorize("5. Testing Gallery API...\n", 'yellow');
$response = makeRequest($baseUrl . '/gallery');
if ($response['status'] === 200) {
    echo colorize("✅ Gallery API working\n", 'green');
    $mediaCount = isset($response['body']['data']) ? count($response['body']['data']) : 0;
    echo "Media items: " . $mediaCount . "\n\n";
} else {
    echo colorize("❌ Gallery API failed\n", 'red');
}

// Test guestbook API
echo colorize("6. Testing Guestbook API...\n", 'yellow');
$response = makeRequest($baseUrl . '/guestbook');
if ($response['status'] === 200) {
    echo colorize("✅ Guestbook API working\n", 'green');
    $messageCount = isset($response['body']['data']) ? count($response['body']['data']) : 0;
    echo "Guestbook messages: " . $messageCount . "\n\n";
} else {
    echo colorize("❌ Guestbook API failed\n", 'red');
}

echo colorize("Demo completed! 🎉\n", 'blue');
echo colorize("For full functionality, run:\n", 'yellow');
echo colorize("  php artisan migrate\n", 'green');
echo colorize("  php artisan db:seed\n", 'green');
echo colorize("  php artisan serve\n", 'green');
echo "\n";
echo colorize("Then test authenticated endpoints with a valid API token.\n", 'yellow');