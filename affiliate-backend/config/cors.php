<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'OPTIONS'],

    // Allow all origins since Chrome Extensions use chrome-extension:// scheme
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [
        '#^chrome-extension://.*#',
    ],

    'allowed_headers' => ['Content-Type', 'Accept', 'X-Extension-Key', 'X-Requested-With'],

    'exposed_headers' => [],

    'max_age' => 86400, // Cache preflight for 24 hours

    'supports_credentials' => false,

];
