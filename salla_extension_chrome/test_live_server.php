<?php
/**
 * Detailed test for affiliate.iqla3.com
 */

$liveUrl = 'https://affiliate.iqla3.com';
$testStoreUrl = 'https://snaf.co/';

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

$html = @file_get_contents($liveUrl, false, $ctx);
preg_match('/<meta name="csrf-token" content="([^"]+)"/', $html ?? '', $csrfMatch);
$csrf = $csrfMatch[1] ?? '';
echo "CSRF Token: " . ($csrf ? "FOUND" : "NOT FOUND") . "\n\n";

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
$data = json_decode($result ?? '', true);

if ($data && isset($data['success'])) {
    echo "=== SUCCESSFUL JSON RESPONSE ===\n";
    print_r($data);
} else {
    echo "=== ERROR OR NON-JSON RESPONSE ===\n";
    echo "Status Line: " . ($http_response_header[0] ?? 'N/A') . "\n";
    echo "First 1000 chars of response:\n";
    echo substr($result ?? 'EMPTY', 0, 1000) . "\n";
    
    if (str_contains($result ?? '', 'message')) {
        echo "\nExtracted Message: ";
        if (preg_match('/"message":"([^"]+)"/', $result, $m)) echo $m[1];
        elseif (preg_match('/<h1[^>]*>([^<]+)<\/h1>/', $result, $m)) echo $m[1];
    }
}
