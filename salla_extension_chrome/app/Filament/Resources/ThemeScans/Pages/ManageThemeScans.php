<?php

namespace App\Filament\Resources\ThemeScans\Pages;

use App\Filament\Resources\ThemeScans\ThemeScanResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageThemeScans extends ManageRecords
{
    protected static string $resource = ThemeScanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
