<?php

namespace App\Filament\Resources\Themes\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ThemeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('platform')
                    ->required()
                    ->default('Salla'),
                TextInput::make('external_id')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('affiliate_url')
                    ->url(),
                TextInput::make('discount_code'),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
