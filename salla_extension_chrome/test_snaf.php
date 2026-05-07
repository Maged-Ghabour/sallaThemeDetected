<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\StoreDetectorService;

$url = 'https://snaf.co/';
$service = new StoreDetectorService();
$result = $service->detect($url);

echo "Testing URL: $url\n";
echo "---------------------------\n";
echo "Success   : " . ($result['success'] ? 'YES' : 'NO') . "\n";
echo "Platform  : " . ($result['platform'] ?? 'N/A') . "\n";
echo "Theme     : " . ($result['theme'] ?? 'N/A') . "\n";
echo "Debug Info:\n";
print_r($result['debug']);
