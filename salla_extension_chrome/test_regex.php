<?php

$url = 'https://n9-store.com/'; // Some random Salla store, or we can use generic.
$html = file_get_contents($url);

$themeId = null;
if (preg_match('/themes\/(\d+)\//i', $html, $matches)) {
    $themeId = "themes: " . $matches[1];
} elseif (preg_match('/theme[_-](\d+)\.css/i', $html, $matches)) {
    $themeId = "theme.css: " . $matches[1];
} elseif (preg_match('/(?:theme_id|themeId)[\'"]?\s*:\s*[\'"]?(\d{5,})[\'"]?/i', $html, $matches)) {
    $themeId = "theme_id: " . $matches[1];
} elseif (preg_match('/"id"\s*:\s*(\d{5,})[^}]*theme/i', $html, $matches)) {
    $themeId = "id theme: " . $matches[1];
} elseif (preg_match('/"theme"\s*:\s*\{.*?"id"\s*:\s*(\d+)/i', $html, $matches)) {
    $themeId = "theme object id: " . $matches[1];
}

var_dump($themeId);

// Check if we can find Raed id
if (strpos($html, '1247874246') !== false) {
    echo "Found Raed ID 1247874246 directly!\n";
}
