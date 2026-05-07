<?php
require 'vendor/autoload.php';
use Illuminate\Support\Facades\Http;

$url = 'https://mobi.sa/';
$ua = 'WhatsApp/2.21.12.21 A';

echo "Fetching $url with UA: $ua...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, $ua);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$html = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

echo "HTTP Code: " . $info['http_code'] . "\n";
echo "Length: " . strlen($html) . " bytes\n";

if ($html) {
    echo "Check for 1155479931: " . (str_contains($html, '1155479931') ? 'FOUND' : 'NOT FOUND') . "\n";
    echo "Check for themes/: " . (str_contains($html, 'themes/') ? 'FOUND' : 'NOT FOUND') . "\n";
    
    preg_match_all('/themes\/(\d+)/i', $html, $matches);
    echo "Matches for themes/(\d+): " . count($matches[0]) . "\n";
    foreach($matches[0] as $m) echo " - $m\n";
    
    // Search for any theme IDs in the whole HTML
    $ids = ["1155479931", "538856565", "596333041"];
    foreach($ids as $id) {
        if (str_contains($html, $id)) echo "ID $id FOUND in HTML!\n";
    }
}
