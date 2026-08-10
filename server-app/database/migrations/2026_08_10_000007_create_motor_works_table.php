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
        Schema::create('motor_works', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('workshop_type_id');
            $table->foreign('workshop_type_id')->references('id')->on('workshop_types')->cascadeOnDelete();
            $table->unsignedBigInteger('motor_work_category_id');
            $table->foreign('motor_work_category_id')->references('id')->on('motor_work_categories')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motor_works');
    }
};
