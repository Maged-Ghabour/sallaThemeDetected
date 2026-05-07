<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\WebDetectorController;

Route::get('/', function () {
    return view('welcome');
});

// Proxy route: browser calls this, server fetches the URL and returns HTML
Route::get('/proxy', function (Request $request) {
    $url = $request->get('url');
    if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
        return response('Invalid URL', 400);
    }
    try {
        $res = \Illuminate\Support\Facades\Http::withoutVerifying()
            ->timeout(12)
            ->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language' => 'ar,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding' => 'gzip, deflate, br',
                'DNT' => '1',
                'Upgrade-Insecure-Requests' => '1',
                'Sec-Fetch-Dest' => 'document',
                'Sec-Fetch-Mode' => 'navigate',
                'Sec-Fetch-Site' => 'none',
                'Cache-Control' => 'max-age=0',
            ])
            ->get($url);
        return response($res->body(), 200)
            ->header('Content-Type', 'text/plain; charset=utf-8')
            ->header('Access-Control-Allow-Origin', '*');
    } catch (\Exception $e) {
        return response('Error: ' . $e->getMessage(), 500);
    }
});

Route::post('/detect', [WebDetectorController::class, 'detect'])->name('web.detect');

Route::get('/test-salla', function (\Illuminate\Http\Request $request) {
    $url = $request->get('url', 'https://salla.sa');
    $response = \Illuminate\Support\Facades\Http::withoutVerifying()->timeout(10)->withHeaders([
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ])->get($url);
    
    return [
        'status' => $response->status(),
        'body_preview' => substr($response->body(), 0, 1000)
    ];
});

Route::get('/debug-salla-log', function () {
    $path = storage_path('logs/failed_salla.html');
    if (file_exists($path)) {
        return response(file_get_contents($path), 200)->header('Content-Type', 'text/plain');
    }
    return "No failed salla log found.";
});
