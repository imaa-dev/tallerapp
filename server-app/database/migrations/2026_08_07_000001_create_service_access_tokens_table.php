<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('servi_id');
            $table->foreign('servi_id')->references('id')->on('servis')->onDelete('cascade');
            $table->string('status', 50);
            $table->string('token', 64)->unique();
            $table->boolean('client_accessed')->default(false);
            $table->boolean('pdf_downloaded')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_access_tokens');
    }
};
