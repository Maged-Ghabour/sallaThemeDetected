<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser; // هام جداً
use Filament\Panel; // هام جداً
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * تحديد من يمكنه دخول لوحة التحكم
     */
    public function canAccessPanel(Panel $panel): bool
    {
        // السماح لجميع المستخدمين المسجلين بالدخول
        return true;
    }
}
