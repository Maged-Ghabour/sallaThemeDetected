<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Theme;
use Exception;

class StoreDetectorService
{
    public function detect(string $url): array
    {
        $debug = [
            'input_url'       => $url,
            'service_version' => '3.0.0_DB_ONLY',
            'steps'           => [],
        ];

        // ── Step 0: Normalize URL ──────────────────────────────────────────────
        if (!preg_match('~^(?:f|ht)tps?://~i', $url)) {
            $url = 'https://' . $url;
        }
        $debug['normalized_url'] = $url;

        // ── Step 1: Fetch HTML ─────────────────────────────────────────────────
        $html = null;
        $fetchMethod = null;

        // 1a. Direct fetch
        [$html, $fetchError] = $this->fetchDirect($url);
        if ($html && !$this->isCloudflareChallenge($html)) {
            $fetchMethod = 'direct';
        } else {
            $debug['steps'][] = 'direct_fetch_failed: ' . ($fetchError ?? ($html ? 'cloudflare_challenge' : 'empty_body'));

            // 1b. Google Cache
            [$html, $fetchError] = $this->fetchFromGoogleCache($url);
            if ($html && !$this->isCloudflareChallenge($html)) {
                $fetchMethod = 'google_cache';
            } else {
                $debug['steps'][] = 'google_cache_failed: ' . ($fetchError ?? ($html ? 'cloudflare_challenge' : 'empty_body'));

                // 1c. Wayback Machine
                [$html, $fetchError] = $this->fetchFromWayback($url);
                if ($html) {
                    $fetchMethod = 'wayback_machine';
                } else {
                    $debug['steps'][] = 'wayback_failed: ' . ($fetchError ?? 'empty_body');
                }
            }
        }

        if (!$html) {
            return [
                'success' => false,
                'message' => 'تعذر الوصول إلى الموقع. تأكد من صحة الرابط.',
                'debug'   => $debug,
            ];
        }

        $debug['fetch_method']  = $fetchMethod;
        $debug['html_length']   = strlen($html);
        $debug['html_snippet']  = substr($html, 0, 400);
        $debug['steps'][]       = "html_fetched_ok via $fetchMethod (" . strlen($html) . " bytes)";

        return $this->analyzeHtml($html, $debug);
    }

    // ── Fetch Helpers ──────────────────────────────────────────────────────────

    /** Returns [string|null $body, string|null $error] */
    private function fetchDirect(string $url): array
    {
        try {
            $response = Http::withoutVerifying()->timeout(10)->withHeaders([
                'User-Agent'      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept'          => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language' => 'ar,en-US;q=0.9,en;q=0.8',
            ])->get($url);

            $body = $response->body();
            $status = $response->status();

            if (strlen($body) < 500) {
                return [null, "too_short:{$status}:" . strlen($body) . "bytes"];
            }
            return [substr($body, 0, 3000000), null];
        } catch (Exception $e) {
            return [null, 'exception:' . $e->getMessage()];
        }
    }

    private function fetchFromGoogleCache(string $url): array
    {
        try {
            $cacheUrl = 'https://webcache.googleusercontent.com/search?q=cache:' . urlencode($url);
            $response = Http::withoutVerifying()->timeout(12)->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            ])->get($cacheUrl);

            $body = $response->body();
            if (strlen($body) < 2000 || str_contains($body, 'google.com/search?q=')) {
                return [null, 'google_cache_blocked_or_short'];
            }
            return [substr($body, 0, 3000000), null];
        } catch (Exception $e) {
            return [null, 'exception:' . $e->getMessage()];
        }
    }

    private function fetchFromWayback(string $url): array
    {
        try {
            $availUrl  = 'https://archive.org/wayback/available?url=' . urlencode($url);
            $availRes  = Http::withoutVerifying()->timeout(8)->get($availUrl);
            $availData = $availRes->json();
            $snapshotUrl = $availData['archived_snapshots']['closest']['url'] ?? null;

            if (!$snapshotUrl) {
                return [null, 'no_wayback_snapshot'];
            }

            $archivedRes = Http::withoutVerifying()->timeout(15)->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; research-bot)',
            ])->get($snapshotUrl);

            $body = $archivedRes->body();
            if (strlen($body) < 2000) {
                return [null, 'wayback_body_too_short'];
            }
            return [substr($body, 0, 3000000), null];
        } catch (Exception $e) {
            return [null, 'exception:' . $e->getMessage()];
        }
    }

    private function isCloudflareChallenge(string $html): bool
    {
        return str_contains($html, 'challenges.cloudflare.com')
            || str_contains($html, 'Just a moment')
            || str_contains($html, 'Enable JavaScript and cookies to continue')
            || (str_contains($html, '_cf_chl_opt') && strlen($html) < 60000);
    }

    // ── Analysis ───────────────────────────────────────────────────────────────

    private function analyzeHtml(string $html, array $debug): array
    {
        $platform   = 'Unknown';
        $themeId    = null;
        $theme      = 'Unknown';
        $confidence = 0;

        // ── Step 2: Detect Platform + extract Theme ID from CDN URL ───────────
        //
        // Salla stores always load assets from:
        //   cdn.assets.salla.network/themes/{THEME_ID}/x.x.x/file.js
        //
        if (preg_match('/cdn\.assets\.salla\.network\/themes\/(\d+)\//', $html, $m)) {
            $platform   = 'Salla';
            $themeId    = $m[1];
            $confidence = 99;
            $debug['steps'][] = "platform=Salla | theme_id=$themeId (from CDN URL, confidence=99)";

        } elseif (
            str_contains($html, 'salla.sa') ||
            str_contains($html, 'salla.network') ||
            str_contains($html, 'salla-theme') ||
            preg_match('/salla/i', $html)
        ) {
            $platform   = 'Salla';
            $confidence = 80;
            $debug['steps'][] = 'platform=Salla (keyword match, no CDN URL found, confidence=80)';

        } elseif (preg_match('/cdn\.zid\.sa\/themes\/([^\/]+)\//', $html, $m)) {
            $platform   = 'Zid';
            $themeId    = $m[1];
            $confidence = 99;
            $debug['steps'][] = "platform=Zid | theme_id=$themeId (from CDN URL, confidence=99)";

        } elseif (str_contains($html, 'zid.store') || str_contains($html, 'zid-theme')) {
            $platform   = 'Zid';
            $confidence = 80;
            $debug['steps'][] = 'platform=Zid (keyword match, no CDN URL found, confidence=80)';
        }

        if ($platform === 'Unknown') {
            $debug['steps'][] = 'platform=Unknown — not a Salla/Zid store';
            return [
                'success'  => false,
                'platform' => 'Other',
                'theme'    => 'Unknown',
                'debug'    => $debug,
            ];
        }

        $debug['platform'] = $platform;
        $debug['theme_id'] = $themeId;

        // ── Step 3: Database lookup with Hardcoded Fallback ───────────────────
        if ($themeId) {
            try {
                // 3a. Check DB
                $dbTheme = Theme::where('external_id', $themeId)->first();

                if ($dbTheme) {
                    $theme = $dbTheme->name;
                    $debug['steps'][]  = "db_lookup: FOUND theme_id=$themeId => name=$theme";
                    $debug['db_hit']   = true;
                } else {
                    $debug['steps'][] = "db_lookup: NOT FOUND in DB for theme_id=$themeId";
                    $debug['db_hit']  = false;

                    // 3b. Hardcoded Fallback for common themes (just in case)
                    $fallbacks = [
                        '1247874246' => 'رائد',
                        '581928698'  => 'سيليا',
                        '632105401'  => 'سيليا',
                        '1155479931' => 'زينة',
                    ];

                    if (isset($fallbacks[(string)$themeId])) {
                        $theme = $fallbacks[(string)$themeId];
                        $debug['steps'][] = "hardcoded_fallback: FOUND theme_id=$themeId => name=$theme";
                    } else {
                        // 3c. If still unknown, show the ID as the name
                        $theme = "ثيم غير معروف (ID: $themeId)";
                        $debug['steps'][] = "no_name_found: returning ID as name";
                    }
                }
            } catch (Exception $e) {
                $debug['steps'][]    = 'db_error: ' . $e->getMessage();
                $theme = "خطأ في البحث (ID: $themeId)";
            }
        } else {
            $debug['steps'][] = 'db_lookup: SKIPPED — no theme_id extracted';
        }

        // ── Step 4: Final result ───────────────────────────────────────────────
        $debug['detected_id']   = $themeId;
        $debug['detected_name'] = $theme;
        $debug['service_version'] = '3.1.0_FLEXIBLE';

        return [
            'success'    => true,
            'platform'   => $platform,
            'theme'      => $theme,
            'confidence' => $confidence,
            'debug'      => $debug,
            'whatsapp'   => '201284867755',
        ];
    }
}
