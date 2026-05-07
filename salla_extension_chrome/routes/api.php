<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\TrackController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Middleware\VerifyExtensionKey;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/config', [ConfigController::class, 'index']);
Route::post('/track', [TrackController::class, 'store']);
Route::get('/stores/similar', [StoreController::class, 'getSimilarStores']);

// Lookup a domain in the DB (from extension scans)
Route::get('/lookup', function (\Illuminate\Http\Request $request) {
    $url = $request->get('url', '');
    try {
        $host = parse_url($url, PHP_URL_HOST) ?: $url;
        $host = preg_replace('/^www\./', '', $host);
        
        // Priority 1: Record with a valid theme name
        $scan = \App\Models\ThemeScan::where('store_domain', 'LIKE', '%' . $host . '%')
            ->whereNotNull('theme_name')
            ->where('theme_name', '!=', 'Unknown')
            ->where('theme_name', '!=', 'غير معروف')
            ->latest()
            ->first();
            
        // Priority 2: Any record for this domain (fallback)
        if (!$scan) {
            $scan = \App\Models\ThemeScan::where('store_domain', 'LIKE', '%' . $host . '%')
                ->latest()
                ->first();
        }


        if ($scan) {
            return response()->json([
                'found' => true,
                'platform' => $scan->platform,
                'theme' => $scan->theme_name,
                'domain' => $scan->store_domain,
                'scanned_at' => $scan->created_at,
            ]);
        }
        return response()->json(['found' => false]);
    } catch (\Exception $e) {
        return response()->json(['found' => false, 'error' => $e->getMessage()]);
    }
});

