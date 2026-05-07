<?php

namespace App\Filament\Widgets;

use App\Models\ThemeScan;
use Filament\Widgets\ChartWidget;

class TopThemesChart extends ChartWidget
{
    protected static ?int $sort = 2;
    protected ?string $heading = 'أكثر 10 ثيمات تم فحصها';

    protected function getData(): array
    {
        $topThemes = ThemeScan::selectRaw('theme_name, COUNT(*) as count')
            ->whereNotNull('theme_name')
            ->groupBy('theme_name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'مرات الفحص',
                    'data' => $topThemes->pluck('count')->toArray(),
                    'backgroundColor' => '#10b981', // green shade
                    'borderColor' => '#059669',
                ],
            ],
            'labels' => $topThemes->pluck('theme_name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
