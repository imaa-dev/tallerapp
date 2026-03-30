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
        Schema::create('service_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('servi_id');
            $table->unsignedBigInteger('status_service_id');
            $table->unsignedBigInteger('file_id');
            $table->foreign('servi_id')->references('id')->on('servis');
            $table->foreign('status_service_id')->references('id')->on('status_services');
            $table->foreign('file_id')->references('id')->on('files');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_files');
    }
};
