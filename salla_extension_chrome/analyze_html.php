<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Read the saved HTML and look for Salla store domain
$html = file_get_contents('salla_failed_live.html');

// Extract any link or src patterns
preg_match_all('/https?:\/\/[a-zA-Z0-9\-\.]+\.salla\.(?:sa|store)[^\s\'"<>]+/i', $html, $m1);
preg_match_all('/https?:\/\/[a-zA-Z0-9\-\.]+\.s3\.amazonaws\.com[^\s\'"<>]+/i', $html, $m2);
preg_match_all('/\/api\/v\d\/[^\s\'"<>]+/i', $html, $m3);
preg_match_all('/data-store="([^"]+)"/i', $html, $m4);
preg_match_all('/window\.__[A-Z_]+=(\{[^;]{0,500})/i', $html, $m5);
preg_match_all('/storeDomain["\']?\s*[=:]\s*["\']([^"\']+)/i', $html, $m6);

echo "=== Salla URLs ===\n";
echo implode("\n", array_unique(array_slice($m1[0], 0, 10))) . "\n\n";

echo "=== API Paths ===\n";
echo implode("\n", array_unique(array_slice($m3[0], 0, 10))) . "\n\n";

echo "=== Data-store ===\n";
print_r($m4[1]);

echo "=== Store Domain ===\n";
print_r($m6[1]);

echo "=== Window Variables (first 300 chars) ===\n";
foreach (array_slice($m5[1], 0, 3) as $v) {
    echo substr($v, 0, 300) . "\n---\n";
}
