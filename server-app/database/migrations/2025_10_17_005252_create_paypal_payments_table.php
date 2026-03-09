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
        Schema::create('paypal_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments_subscriptions')->onDelete('cascade');
            $table->string('payer_id')->nullable();
            $table->string('order_id')->nullable();
            $table->string('payer_email')->nullable();
            $table->string('capture_id')->nullable();
            $table->string('payer_status')->nullable();
            $table->json('raw_response')->nullable(); // Guardar JSON completo del webhook o API
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paypal_payments');
    }
};
