<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Theme;
use Exception;

class StoreDetectorService
{
    public function detect(string $url): array
    {
        // Ensure URL has scheme
        if (!preg_match('~^(?:f|ht)tps?://~i', $url)) {
            $url = "https://" . $url;
        }

        // Try direct fetch first (WhatsApp Mode)
        $html = $this->fetchDirect($url);

        // Fallbacks
        if (!$html || $this->isCloudflareChallenge($html)) {
            $html = $this->fetchFromGoogleCache($url);
        }

        if (!$html || $this->isCloudflareChallenge($html)) {
            $html = $this->fetchFromWayback($url);
        }

        if (!$html) {
            return [
                'success' => false,
                'message' => 'تعذر الوصول إلى الموقع. تأكد من صحة الرابط.'
            ];
        }

        return $this->analyzeHtml($html);
    }

    private function fetchDirect(string $url): ?string
    {
        try {
            // Modern Browser User-Agent
            $response = Http::withoutVerifying()->timeout(10)->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language' => 'ar,en-US;q=0.9,en;q=0.8',
            ])->get($url);

            
            $body = $response->body();
            if ($response->successful() && (str_contains($body, 'salla') || str_contains($body, 'Salla'))) {
                return substr($body, 0, 3000000);
            }
            
            return strlen($body) > 1000 ? substr($body, 0, 3000000) : null;
        } catch (Exception $e) {
            return null;
        }
    }

    private function fetchFromGoogleCache(string $url): ?string
    {
        try {
            $cacheUrl = "https://webcache.googleusercontent.com/search?q=cache:" . urlencode($url);
            $response = Http::withoutVerifying()->timeout(12)->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            ])->get($cacheUrl);

            $body = $response->body();
            if (strlen($body) < 2000 || str_contains($body, 'google.com/search?q=')) return null;
            return substr($body, 0, 3000000);
        } catch (Exception $e) {
            return null;
        }
    }

    private function fetchFromWayback(string $url): ?string
    {
        try {
            $availUrl = "https://archive.org/wayback/available?url=" . urlencode($url);
            $availRes = Http::withoutVerifying()->timeout(8)->get($availUrl);
            $availData = $availRes->json();
            $snapshotUrl = $availData['archived_snapshots']['closest']['url'] ?? null;

            if (!$snapshotUrl) return null;

            $archivedRes = Http::withoutVerifying()->timeout(15)->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; research-bot)'
            ])->get($snapshotUrl);

            $body = $archivedRes->body();
            return strlen($body) > 2000 ? substr($body, 0, 3000000) : null;
        } catch (Exception $e) {
            return null;
        }
    }

    private function isCloudflareChallenge(string $html): bool
    {
        return str_contains($html, 'challenges.cloudflare.com')
            || str_contains($html, 'Just a moment')
            || str_contains($html, 'Enable JavaScript and cookies to continue')
            || (str_contains($html, '_cf_chl_opt') && strlen($html) < 60000);
    }

    private function analyzeHtml(string $html): array
    {
        $platform = 'Unknown';
        $theme = 'Unknown';
        $themeId = null;
        $confidence = 0;
        $debug = [
            'html_length' => strlen($html),
            'whatsapp_mode' => true,
            'exhaustive_scan' => true
        ];

        // 1. Detect Platform (Case-Insensitive)
        $htmlLower = strtolower($html);
        if (str_contains($htmlLower, 'salla.sa') || str_contains($htmlLower, 'salla.network') || str_contains($htmlLower, 'salla-theme') || str_contains($htmlLower, 'salla-cdn') || preg_match('/salla/i', $html)) {
            $platform = 'Salla';
            $confidence = 95;
        } elseif (str_contains($htmlLower, 'zid.store') || str_contains($htmlLower, 'zid-theme')) {
            $platform = 'Zid';
            $confidence = 90;
        }

        $debug['html_snippet'] = substr($html, 0, 500);


        if ($platform === 'Unknown') {
            return [
                'success' => false,
                'platform' => 'Other',
                'theme' => 'Unknown',
                'debug' => $debug
            ];
        }

        $debug['platform'] = $platform;

        // 2. Extract Theme ID from Asset URLs (Accurate Detection)
        if ($platform === 'Salla') {
            if (preg_match('/cdn\.assets\.salla\.network\/themes\/(\d+)\//', $html, $matches)) {
                $themeId = $matches[1];
                $debug['found_by'] = 'salla_asset_url';
            }
        } elseif ($platform === 'Zid') {
            if (preg_match('/cdn\.zid\.sa\/themes\/([^\/]+)\//', $html, $matches)) {
                $themeId = $matches[1];
                $debug['found_by'] = 'zid_asset_url';
            }
        }

        // 3. Database Lookup for Theme Name
        if ($themeId) {
            $dbTheme = Theme::where('external_id', $themeId)->first();
            if ($dbTheme) {
                $theme = $dbTheme->name;
                $debug['found_in_db'] = true;
            }
        }

        // 4. Fallback: Load Theme Dictionary & Exhaustive Search (if DB lookup failed or ID not found in assets)
        if ($theme === 'Unknown') {
            $themeMap = $this->getSallaThemeIds();
            
            // Search for ID in assets if not found by specific regex above
            if (!$themeId) {
                if (preg_match_all('/(\d{8,15})/', $html, $matches)) {
                    $foundNumbers = array_unique($matches[1]);
                    foreach ($foundNumbers as $num) {
                        if (isset($themeMap[(string)$num]) || isset($themeMap[(int)$num])) {
                            $themeId = $num;
                            $theme = $themeMap[$num];
                            $debug['found_by'] = 'exhaustive_id_match';
                            break;
                        }
                    }
                }
            } else if (isset($themeMap[$themeId])) {
                $theme = $themeMap[$themeId];
            }
        }

        // Special check for Selia (Common in Boh Perfume)
        if ($theme === 'Unknown' && str_contains($html, '581928698')) {
            $theme = 'سيليا';
            $themeId = '581928698';
            $debug['found_by'] = 'manual_selia_check';
        }

        $debug['detected_id'] = $themeId;
        $debug['detected_name'] = $theme;
        $debug['service_version'] = '1.2.4_DYNAMIC';

        return [
            'success' => true,
            'platform' => $platform,
            'theme' => $theme,
            'confidence' => $confidence,
            'debug' => $debug,
            'whatsapp' => '201284867755'
        ];
    }

    private function getSallaThemeIds(): array
    {
        return [
            "581928698"=> "سيليا", "632105401"=> "سيليا", "1155479931"=> "زينة", "596333041"=> "أطياف", "538856565"=> "أطياف",
            "766360058"=> "فخامة", "1617628556"=> "امتياز", "1034648396"=> "ملاك", "1696219221"=> "وسام", "197173496"=> "مختلف",
            "575338046"=> "طاهر", "513499943"=> "بريستيج", "268429610"=> "نمو", "1245464956"=> "جميل", "1049159835"=> "موعد",
            "600639717"=> "كليك", "466157229"=> "أكاسيا", "2048178472"=> "بيوتي", "1480248829"=> "متجر", "2101895899"=> "رهيب",
            "1894368909"=> "اطلالة", "1974201424"=> "رؤية", "1660707346"=> "رقمى", "581928698"=> "سيليا", "632105401"=> "سيليا", "1753517624"=> "عالي",
            "1755865368"=> "بوتيك", "1253916907"=> "بيلا", "724522601"=> "مبدع", "1048198927"=> "شوبنج", "2093313756"=> "يافا",
            "2142196958"=> "بريق", "1016570170"=> "علا", "2071596307"=> "جلامور", "1485429532"=> "ريس", "539684003"=> "خيوط",
            "1462103872"=> "قصص", "1145699248"=> "كراون", "338190499"=> "كيان", "1582624105"=> "لوفيزا", "368921700"=> "نماء",
            "1662840947"=> "ماركت", "245671147"=> "روح", "822457965"=> "عطاء", "1546328629"=> "سمارت", "638956130"=> "ثمن",
            "945336214"=> "ساجي", "1827574400"=> "رناواي", "596333041"=> "أطياف", "1534326188"=> "رِحلة", "1460868166"=> "آرت",
            "502925332"=> "جلوبى", "268341705"=> "ذهب", "1544606478"=> "مرح", "265993961"=> "عِنان", "1241617822"=> "رحيق", "538856565"=> "أطياف",
            "1155479931"=> "زينة", "2084773836"=> "فريشمارت", "1822327849"=> "قهوة", "429755461"=> "غنا", "1780291170"=> "بيانو", "510413540"=> "فاشون",
            "781706584"=> "جميلة", "1577196143"=> "بليند", "77875411"=> "جولدن", "1734608997"=> "بـريـس_تـا", "1980654236"=> "خيال",
            "1155479931"=> "زينة",
        ];
    }
}
