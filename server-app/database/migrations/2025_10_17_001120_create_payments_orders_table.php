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
        Schema::create('payments_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders');
            $table->decimal('amount');
            $table->enum('payment_method', ['card', 'transfer', 'crypto', 'cash'])->default('card');
            $table->enum('status', ['pending', 'canceled', 'failed'])->default('pending');
            $table->string('transaction_id');
            $table->decimal('subtotal');
            $table->dateTime('paid_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments_orders');
    }
};
