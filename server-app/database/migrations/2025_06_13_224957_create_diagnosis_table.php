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
        Schema::create('diagnosis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('servi_id');
            $table->unsignedBigInteger('reason_id');
            $table->foreign('servi_id')->references('id')->on('servis')->onDelete('cascade');
            $table->foreign('reason_id')->references('id')->on('reasons')->onDelete('cascade');
            $table->string('diagnosis');
            $table->string('repair_time');
            $table->double('cost');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnosis');
    }
};
