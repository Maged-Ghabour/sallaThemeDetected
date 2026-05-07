<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$detector = app(\App\Services\StoreDetectorService::class);
$urls = [
    'https://salla.sa/dokan'
];

foreach ($urls as $u) {
    echo "Testing: $u\n";
    $html = Illuminate\Support\Facades\Http::get($u)->body();
    file_put_contents('salla_dokan.html', $html);
    $res = $detector->detect($u);
    if ($res['success']) {
        echo "Platform: {$res['platform']}, Theme: {$res['theme']}\n\n";
    } else {
        echo "Error: {$res['message']}\n\n";
    }
}
