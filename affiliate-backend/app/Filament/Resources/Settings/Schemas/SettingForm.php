<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class SettingForm
{
    /**
     * أوصاف كل إعداد وتأثيره في الإضافة
     */
    private static array $descriptions = [
        'whatsapp'      => '📱 رقم الواتساب (مع رمز الدولة مثال: +966500000000) — يظهر في زر تصميم متجر وفي صفحة الروابط.',
        'twitter'       => '🐦 رابط حساب تويتر/X الكامل (مثال: https://x.com/yourhandle) — يظهر في صفحة الروابط.',
        'telegram'      => '✈️ رابط قناة أو حساب تيليجرام (مثال: https://t.me/yourchannel) — يظهر في صفحة الروابط.',
        'instagram'     => '📸 رابط حساب انستغرام (مثال: https://instagram.com/yourhandle) — يظهر في صفحة الروابط.',
        'tiktok'        => '🎥 رابط حساب تيكتوك (مثال: https://tiktok.com/@yourhandle) — يظهر في صفحة الروابط.',
        'youtube'       => '🎦 رابط قناة يوتيوب (مثال: https://youtube.com/@yourchannel) — يظهر في صفحة الروابط.',
        'coffee'        => '☕ رابط صفحة دعم المطور (Buy Me a Coffee) — يظهر كبطاقة في أعلى صفحة الروابط.',
        'website'       => '🌐 رابط الموقع الإلكتروني (مثال: https://yoursite.com) — يظهر في صفحة الروابط.',
        'toast_message' => '🔔 رسالة تظهر أسفل نافذة الكشف على المتاجر. مثال: "🎉 اكتشفنا ثيمك!".',
        'special_offer' => '🏷️ نص عرض خاص يظهر في بطاقة التسويق داخل الإضافة. مثال: "خصم 20% هذا الأسبوع فقط!".',
        'alert_message' => '📢 رسالة تنبيه تنبثق لجميع المستخدمين عند فتح الإضافة. مثال: "✨ تم إضافة 30 ثيم جديد!".',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\Select::make('key')
                    ->label('نوع الإعداد')
                    ->options([
                        'whatsapp'      => '📱 رقم الواتساب',
                        'twitter'       => '🐦 رابط تويتر/X',
                        'telegram'      => '✈️ رابط تيليجرام',
                        'instagram'     => '📸 رابط انستغرام',
                        'tiktok'        => '🎥 رابط تيكتوك',
                        'youtube'       => '🎦 رابط يوتيوب',
                        'coffee'        => '☕ رابط دعم المطور (Coffee)',
                        'website'       => '🌐 رابط الموقع الإلكتروني',
                        'toast_message' => '🔔 رسالة التوست (على المتاجر)',
                        'special_offer' => '🏷️ نص العرض الخاص (في الإضافة)',
                        'alert_message' => '📢 رسالة تنبيه للمستخدمين',
                    ])
                    ->required()
                    ->live()
                    ->helperText(fn ($state) => static::$descriptions[$state] ?? 'اختر نوع الإعداد لعرض التوضيح.'),

                Textarea::make('value')
                    ->label('القيمة')
                    ->required()
                    ->rows(3)
                    ->placeholder('اكتب القيمة هنا...')
                    ->columnSpanFull(),
            ]);
    }
}
