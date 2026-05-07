<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyExtensionKey
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $validKey = config('app.extension_api_key', env('EXTENSION_API_KEY'));

        // Allow /api/config without key (read-only, public is fine)
        // Only protect write endpoints like /api/track
        $sentKey = $request->header('X-Extension-Key');

        if (!$validKey || $sentKey !== $validKey) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
