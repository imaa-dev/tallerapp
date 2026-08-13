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
        Schema::table('plans', function (Blueprint $table) {
            $table->text('description')->nullable()->after('price');
            $table->string('billing_period')->default('month')->after('description');
            $table->boolean('is_active')->default(true)->after('billing_period');
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['interval', 'duration_days', 'features']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->string('interval')->default('monthly');
            $table->integer('duration_days')->default(30);
            $table->text('features')->nullable();
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['description', 'billing_period', 'is_active']);
        });
    }
};
