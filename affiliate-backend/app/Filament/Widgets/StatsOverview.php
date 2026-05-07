<?php

namespace App\Filament\Widgets;

use App\Models\ThemeScan;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('عمليات فحص سلة', ThemeScan::where('platform', 'Salla')->count())
                ->description('إجمالي فحص ثيمات سلة')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('عمليات فحص زد', ThemeScan::where('platform', 'Zid')->count())
                ->description('إجمالي فحص ثيمات زد')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info'),
            Stat::make('إجمالي الفحوصات', ThemeScan::count())
                ->description('في جميع المنصات')
                ->color('primary'),
        ];
    }
}
