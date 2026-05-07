<?php
$html=file_get_contents('salla_failed_live.html');
$pos = 0;
while (($pos = stripos($html, 'theme', $pos)) !== false) {
    echo "..." . substr($html, max(0, $pos - 30), 100) . "...\n";
    $pos += 5;
}
