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
        Schema::create('servis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('organization_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('status_id');
            $table->foreign('organization_id')->references('id')->on('organizations');
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('status_id')->references('id')->on('status_services');
            $table->foreign('user_id')->references('id')->on('users');
            $table->dateTime('date_entry');
            $table->dateTime('date_exit')->nullable();
            $table->integer('satisfied')->nullable();
            $table->boolean('approve_spare_parts')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servis');
    }
};
