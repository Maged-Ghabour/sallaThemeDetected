<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $guarded = [];

    protected static function booted()
    {
        static::saved(function ($model) {
            \Illuminate\Support\Facades\Cache::forget('api_extension_config');
        });

        static::deleted(function ($model) {
            \Illuminate\Support\Facades\Cache::forget('api_extension_config');
        });
    }
}
