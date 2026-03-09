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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ej: Free, Premium, Enterprise
            $table->decimal('price', 10, 2)->default(0.00);
            $table->string('interval')->default('monthly'); // monthly, yearly
            $table->integer('duration_days')->default(30); // opcional
            $table->text('features')->nullable(); // descripción de beneficios
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
