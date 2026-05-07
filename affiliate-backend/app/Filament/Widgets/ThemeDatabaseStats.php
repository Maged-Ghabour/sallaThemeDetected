<?php

namespace App\Filament\Widgets;

use App\Models\Theme;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ThemeDatabaseStats extends StatsOverviewWidget
{
    protected static ?int $sort = 0; // Put it at the very top

    protected function getStats(): array
    {
        return [
            Stat::make('مرحباً بك!', 'لوحة تحكم إضافة فحص الثيمات')
                ->description('أهلاً بك يا مدير النظام')
                ->color('primary')
                ->icon('heroicon-o-sparkles'),

            Stat::make('إجمالي ثيمات سلة', Theme::where('platform', 'Salla')->count())
                ->description('المخزنة في قاعدة البيانات')
                ->color('success')
                ->icon('heroicon-o-shopping-bag'),

            Stat::make('إجمالي ثيمات زد', Theme::where('platform', 'Zid')->count())
                ->description('المخزنة في قاعدة البيانات')
                ->color('info')
                ->icon('heroicon-o-shopping-cart'),
        ];
    }
}
