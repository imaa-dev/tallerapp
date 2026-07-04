<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('monero_payments');
    }

    public function down(): void
    {
        Schema::create('monero_payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('payment_id')
                ->constrained('payments_subscriptions')
                ->onDelete('cascade');

            $table->string('tx_hash')->nullable();
            $table->string('wallet_address')->nullable();
            $table->integer('confirmations')->nullable();
            $table->string('block_height')->nullable();

            $table->json('raw_response')->nullable();

            $table->timestamps();
        });
    }
};