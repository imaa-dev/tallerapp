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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations');
            $table->foreignId('categorie_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->integer('serial_number')->nullable();
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('stock')->nullable();
            $table->string('brand');
            $table->string('model');
            $table->decimal('price')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
