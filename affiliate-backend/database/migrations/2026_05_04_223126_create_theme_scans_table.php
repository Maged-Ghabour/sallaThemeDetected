<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('theme_scans', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->string('theme_external_id')->nullable();
            $table->string('theme_name')->nullable();
            $table->string('store_domain')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_scans');
    }
};
