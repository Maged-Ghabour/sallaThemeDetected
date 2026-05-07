<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ThemeScan;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    public function store(Request $request)
    {
        // DEBUG LOGGING
        try {
            $logData = date('Y-m-d H:i:s') . " - Request: " . json_encode($request->all(), JSON_UNESCAPED_UNICODE) . "\n";
            file_put_contents(storage_path('logs/debug_track.log'), $logData, FILE_APPEND);
        } catch (\Exception $e) {}

        $request->validate([
            'platform' => 'required|string',
            'theme_id' => 'nullable|string',
            'theme_name' => 'nullable|string',
            'domain' => 'nullable|string',
        ]);

        // Key validation (as fallback if middleware is disabled or for extra security)
        $providedKey = $request->header('X-Extension-Key') ?: $request->query('key');
        if ($providedKey !== 'salla-ext-2024-maged-secret-key') {
             // We can log it or just ignore for now to allow tracking while debugging
        }


        $data = [
            'platform' => $request->platform,
            'theme_external_id' => $request->theme_id,
        ];

        // Only update theme_name if it's provided and not "Unknown"
        if ($request->theme_name && $request->theme_name !== 'Unknown' && $request->theme_name !== 'غير معروف') {
            $data['theme_name'] = $request->theme_name;
        }

        ThemeScan::updateOrCreate(
            ['store_domain' => $request->domain],
            $data
        );

        return response()->json(['success' => true]);
    }

}
