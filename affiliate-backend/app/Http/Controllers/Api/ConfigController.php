<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Theme;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    public function index()
    {
        $config = Cache::rememberForever('api_extension_config', function () {
            $themes = Theme::where('is_active', true)->get();
            
            $themeLinks = [];
            $salla_themes = [];
            $zid_themes = [];

            foreach ($themes as $theme) {
                $themeLinks[$theme->external_id] = [
                    'affiliateUrl' => $theme->affiliate_url,
                    'discountCode' => $theme->discount_code ?? 'غير متوفر'
                ];

                if (strtolower($theme->platform) === 'salla') {
                    $salla_themes[$theme->external_id] = $theme->name;
                } elseif (strtolower($theme->platform) === 'zid') {
                    $zid_themes[$theme->external_id] = $theme->name;
                }
            }

            return [
                'themeLinks' => $themeLinks,
                'social' => [
                    'whatsapp'  => Setting::getVal('whatsapp', ''),
                    'twitter'   => Setting::getVal('twitter', ''),
                    'telegram'  => Setting::getVal('telegram', ''),
                    'instagram' => Setting::getVal('instagram', ''),
                    'tiktok'    => Setting::getVal('tiktok', ''),
                    'youtube'   => Setting::getVal('youtube', ''),
                    'coffee'    => Setting::getVal('coffee', ''),
                    'website'   => Setting::getVal('website', ''),
                ],
                'marketing' => [
                    'toastMessage'  => Setting::getVal('toast_message', ''),
                    'specialOffer'  => Setting::getVal('special_offer', ''),
                    'alertMessage'  => Setting::getVal('alert_message', ''),
                    'whatsapp'      => Setting::getVal('whatsapp', ''),
                ],
                'salla_themes' => $salla_themes,
                'zid_themes'   => $zid_themes,
            ];
        });

        return response()->json($config);
    }
}
