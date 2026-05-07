<?php
$html=file_get_contents('salla_failed_live.html');
echo "salla at: " . stripos($html, 'salla') . "\n";
echo "theme at: " . stripos($html, 'theme') . "\n";
echo "1247874246 at: " . stripos($html, '1247874246') . "\n";
