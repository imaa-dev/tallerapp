<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('servis', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
        });

        Schema::table('service_files', function (Blueprint $table) {
            $table->dropForeign(['status_service_id']);
        });

        Schema::dropIfExists('status_services');
    }

    public function down(): void
    {
        Schema::create('status_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::table('servis', function (Blueprint $table) {
            $table->foreign('status_id')->references('id')->on('status_services');
        });

        Schema::table('service_files', function (Blueprint $table) {
            $table->foreign('status_service_id')->references('id')->on('status_services');
        });
    }
};
