<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\StoreDetectorService;
use App\Models\ThemeScan;
use App\Models\Setting;

class WebDetectorController extends Controller
{
    protected StoreDetectorService $detectorService;

    public function __construct(StoreDetectorService $detectorService)
    {
        $this->detectorService = $detectorService;
    }

    public function detect(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        $url = $request->input('url');
        $parsedUrl = parse_url($url);
        $domain = $parsedUrl['host'] ?? $url;

        // If the browser already detected (client_detected=true), just save and return
        if ($request->boolean('client_detected') && $request->filled('platform')) {
            $platform = $request->input('platform', 'Unknown');
            $theme = $request->input('theme', 'Unknown');

            if ($platform !== 'Unknown') {
                ThemeScan::create([
                    'store_domain' => $domain,
                    'platform' => $platform,
                    'theme_name' => $theme !== 'Unknown' ? $theme : null,
                ]);
            }

            return response()->json([
                'success' => true,
                'platform' => $platform,
                'theme' => $theme,
                'whatsapp' => Setting::getVal('whatsapp', ''),
            ]);
        }

        // Server-side detection fallback
        $result = $this->detectorService->detect($url);

        if ($result['success'] && $result['platform'] !== 'Unknown') {
            $data = [
                'platform' => $result['platform'],
            ];
            
            // Only update theme_name if we found something useful
            if ($result['theme'] !== 'Unknown') {
                $data['theme_name'] = $result['theme'];
            }

            \App\Models\ThemeScan::updateOrCreate(
                ['store_domain' => $domain],
                $data
            );
        }


        $result['whatsapp'] = Setting::getVal('whatsapp', '');
        return response()->json($result);
    }
}
