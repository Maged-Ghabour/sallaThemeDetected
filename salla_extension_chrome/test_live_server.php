<?php
/**
 * Test live server: affiliate.iqla3.com
 */

$liveUrl = 'https://affiliate.iqla3.com';
$testStoreUrl = 'https://gsswn-albn.com';

echo "=== Testing $liveUrl ===\n\n";

$ctx = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 10,
        'ignore_errors' => true,
        'header' => "User-Agent: Mozilla/5.0\r\n"
    ],
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
]);

// Step 1: Get homepage + CSRF
$html = @file_get_contents($liveUrl, false, $ctx);
echo "Homepage response length: " . strlen($html ?? '') . " bytes\n";

preg_match('/<meta name="csrf-token" content="([^"]+)"/', $html ?? '', $csrfMatch);
$csrf = $csrfMatch[1] ?? '';
echo "CSRF Token: " . ($csrf ? substr($csrf, 0, 30) . "..." : "NOT FOUND") . "\n\n";

// Step 2: Call /detect
echo "--- Calling POST /detect with $testStoreUrl ---\n";
$payload = json_encode(['url' => $testStoreUrl]);
$detectCtx = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => implode("\r\n", [
            "Content-Type: application/json",
            "Accept: application/json",
            "X-CSRF-TOKEN: $csrf",
            "User-Agent: Mozilla/5.0",
            "Content-Length: " . strlen($payload),
        ]),
        'content' => $payload,
        'timeout' => 30,
        'ignore_errors' => true,
    ],
    'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
]);

$result = @file_get_contents("$liveUrl/detect", false, $detectCtx);
echo "Raw response: " . ($result ?: "EMPTY/FAILED") . "\n\n";

$data = json_decode($result ?? '', true);
if ($data) {
    echo "=== RESULT ===\n";
    echo "Success    : " . ($data['success'] ? 'YES' : 'NO') . "\n";
    echo "Platform   : " . ($data['platform'] ?? 'N/A') . "\n";
    echo "Theme      : " . ($data['theme'] ?? 'N/A') . "\n";
    echo "Confidence : " . ($data['confidence'] ?? 'N/A') . "%\n";
    echo "Version    : " . ($data['debug']['service_version'] ?? '*** OLD VERSION ***') . "\n";
    echo "Found by   : " . ($data['debug']['found_by'] ?? 'N/A') . "\n";
    echo "Theme ID   : " . ($data['debug']['detected_id'] ?? 'N/A') . "\n";
    echo "HTML length: " . ($data['debug']['html_length'] ?? 'N/A') . "\n";
} else {
    echo "Could not parse JSON response.\n";
}
