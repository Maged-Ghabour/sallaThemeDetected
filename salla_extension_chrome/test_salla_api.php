<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$url = 'https://shop.salla.sa'; // I'll use a known Salla store or root
$endpoints = [
    '/api/v1/store/settings',
    '/api/store/info',
    '/api/v1/store/info',
    '/api/store/settings',
    '/.well-known/salla.json'
];

foreach ($endpoints as $ep) {
    $res = \Illuminate\Support\Facades\Http::withoutVerifying()->get($url . $ep);
    echo "$ep => HTTP {$res->status()}\n";
    if ($res->status() == 200) {
        echo substr($res->body(), 0, 200) . "\n\n";
    }
}
