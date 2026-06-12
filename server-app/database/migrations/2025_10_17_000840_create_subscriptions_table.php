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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('plans');
            $table->string('provider');
            $table->string('provider_subscription_id');
            $table->string('provider_customer_id');
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->enum('status', [
                'trial',
                'active',
                'cancelled',
                'expired',
                'suspended',
            ])->default('trial');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
