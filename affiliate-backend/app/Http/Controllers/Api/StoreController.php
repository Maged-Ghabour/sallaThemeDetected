<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ThemeScan;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function getSimilarStores(Request $request)
    {
        $request->validate([
            'theme_name' => 'required|string',
            'current_domain' => 'nullable|string',
        ]);

        $themeName = trim($request->theme_name);
        $currentDomain = trim($request->current_domain);

        // Fetch unique domains with the same theme name
        $stores = ThemeScan::where('theme_name', $themeName)
            ->when($currentDomain, function ($query) use ($currentDomain) {
                return $query->where('store_domain', '!=', $currentDomain);
            })
            ->whereNotNull('store_domain')
            ->distinct()
            ->limit(10)
            ->pluck('store_domain');

        return response()->json([
            'success' => true,
            'stores' => $stores
        ]);
    }
}
