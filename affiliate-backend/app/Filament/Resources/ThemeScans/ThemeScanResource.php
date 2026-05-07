<?php

namespace App\Filament\Resources\ThemeScans;

use App\Filament\Resources\ThemeScans\Pages\ManageThemeScans;
use App\Models\ThemeScan;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ThemeScanResource extends Resource
{
    protected static ?string $model = ThemeScan::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-magnifying-glass';

    protected static ?string $navigationLabel = 'المتاجر المكتشفة';

    protected static ?string $pluralModelLabel = 'المتاجر المكتشفة';

    protected static ?string $modelLabel = 'متجر مكتشف';

    protected static ?string $recordTitleAttribute = 'store_domain';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('platform')
                    ->label('المنصة')
                    ->required(),
                TextInput::make('theme_external_id')
                    ->label('ID الثيم'),
                TextInput::make('theme_name')
                    ->label('اسم الثيم'),
                TextInput::make('store_domain')
                    ->label('رابط المتجر'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('store_domain')
            ->columns([
                TextColumn::make('store_domain')
                    ->label('رابط المتجر')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('theme_name')
                    ->label('اسم الثيم')
                    ->badge()
                    ->color('primary')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('platform')
                    ->label('المنصة')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Salla' => 'purple',
                        'Zid' => 'info',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('theme_external_id')
                    ->label('ID الثيم')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('تاريخ الاكتشاف')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                \Filament\Tables\Filters\SelectFilter::make('platform')
                    ->label('تصفية حسب المنصة')
                    ->options([
                        'Salla' => 'سلة',
                        'Zid' => 'زد',
                    ]),
                \Filament\Tables\Filters\SelectFilter::make('theme_name')
                    ->label('تصفية حسب الثيم')
                    ->searchable()
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageThemeScans::route('/'),
        ];
    }
}
