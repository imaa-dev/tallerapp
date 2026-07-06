<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments_subscriptions', function (Blueprint $table) {
            // Renombrar columnas existentes
            $table->renameColumn('method', 'provider');
            $table->renameColumn('transaction_id', 'provider_payment_id');

            // Modificar columnas existentes
            $table->string('provider', 50)->change();

            $table->enum('status', [
                'pending',
                'completed',
                'failed',
                'refunded',
                'partially_refunded',
                'cancelled',
            ])->default('pending')->change();

            // Nuevas columnas
            $table->string('provider_capture_id')->nullable()->after('provider_payment_id');
            $table->string('payer_id')->nullable()->after('provider_capture_id');
            $table->timestamp('paid_at')->nullable()->after('status');
            $table->json('provider_metadata')->nullable()->after('paid_at');
        });
    }

    public function down(): void
    {
        Schema::table('payments_subscriptions', function (Blueprint $table) {

            $table->dropColumn([
                'provider_capture_id',
                'payer_id',
                'paid_at',
                'provider_metadata',
            ]);

            $table->renameColumn('provider', 'method');
            $table->renameColumn('provider_payment_id', 'transaction_id');

            $table->enum('method', [
                'paypal',
                'monero',
                'stripe'
            ])->change();

            $table->enum('status', [
                'pending',
                'completed',
                'failed'
            ])->default('pending')->change();
        });
    }
};