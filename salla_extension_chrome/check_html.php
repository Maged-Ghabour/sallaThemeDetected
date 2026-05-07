<?php
$html = file_get_contents('salla_failed_live.html');
// Show first 2000 chars
echo "=== FIRST 2000 chars ===\n";
echo substr($html, 0, 2000);

echo "\n\n=== CHECK FOR CLOUDFLARE ===\n";
echo "cloudflare: " . (stripos($html, 'cloudflare') !== false ? 'YES' : 'NO') . "\n";
echo "challenge: " . (stripos($html, 'challenge') !== false ? 'YES' : 'NO') . "\n";
echo "ray id: " . (stripos($html, 'ray id') !== false ? 'YES' : 'NO') . "\n";
echo "just a moment: " . (stripos($html, 'just a moment') !== false ? 'YES' : 'NO') . "\n";
echo "browser check: " . (stripos($html, 'browser check') !== false ? 'YES' : 'NO') . "\n";
echo "tailwind: " . (stripos($html, 'tailwind') !== false ? 'YES' : 'NO') . "\n";
echo "cdn.salla: " . (stripos($html, 'cdn.salla') !== false ? 'YES' : 'NO') . "\n";
echo "salla.network: " . (stripos($html, 'salla.network') !== false ? 'YES' : 'NO') . "\n";

// What URL was scanned?
echo "\n\n=== FIRST SCRIPT TAG ===\n";
preg_match('/<script[^>]*>(.*?)<\/script>/is', $html, $m);
echo substr($m[1] ?? 'none', 0, 500);
