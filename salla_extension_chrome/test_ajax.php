<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$url = 'https://salla.sa/test'; // Let's try to get a Salla store
$res = \Illuminate\Support\Facades\Http::withoutVerifying()->withHeaders([
    'Accept' => 'application/json, text/plain, */*',
    'X-Requested-With' => 'XMLHttpRequest'
])->get($url);

file_put_contents('salla_ajax.json', substr($res->body(), 0, 2000));
echo "Saved ajax response";
