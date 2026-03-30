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
        Schema::create('monero_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments_subscriptions')->onDelete('cascade');
            $table->string('tx_hash')->nullable(); // Hash de la transacción
            $table->string('wallet_address')->nullable(); // Dirección usada
            $table->integer('confirmations')->default(0);
            $table->integer('block_height')->nullable();
            $table->dateTime('received_at')->nullable();
            $table->json('raw_response')->nullable(); // respuesta RPC completa
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monero_payments');
    }
};
