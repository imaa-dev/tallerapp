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
        Schema::create('payment_provider_payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('payment_id')
                ->constrained('payments_subscriptions')
                ->onDelete('cascade');

            $table->string('provider'); 
            // paypal | stripe | mercadopago | transbank

            $table->string('provider_payment_id')->nullable(); // capture_id / charge_id / etc

            $table->string('provider_subscription_id')->nullable();

            $table->string('payer_id')->nullable();
            $table->string('payer_email')->nullable();
            $table->string('payer_status')->nullable();

            $table->string('status')->default('pending');

            $table->json('raw_response')->nullable();

            $table->timestamps();

            $table->index(['provider', 'provider_payment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_provider_payments');
    }
};
