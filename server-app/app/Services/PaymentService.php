<?php

namespace App\Services;

use App\Models\PaymentsSubscription;
use App\Models\PaymentProviderPayment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * ==========================================
     *  CREATE INTERNAL PAYMENT (SaaS CORE)
     * ==========================================
     */
    public function createPayment(
        int $subscriptionId,
        float $amount,
        string $currency = 'USD',
        string $method = 'paypal'
    ): PaymentsSubscription {
        return PaymentsSubscription::create([
            'subscription_id' => $subscriptionId,
            'amount' => $amount,
            'currency' => $currency,
            'method' => $method,
            'status' => 'pending',
        ]);
    }

    /**
     * ==========================================
     *  ATTACH PROVIDER RESPONSE
     * ==========================================
     */
    public function attachProviderPayment(
        PaymentsSubscription $payment,
        string $provider,
        array $data
    ): PaymentProviderPayment {
        return PaymentProviderPayment::create([
            'payment_id' => $payment->id,
            'provider' => $provider,

            'provider_payment_id' =>
                $data['provider_payment_id'] ?? null,

            'provider_subscription_id' =>
                $data['provider_subscription_id'] ?? null,

            'payer_id' =>
                $data['payer_id'] ?? null,

            'payer_email' =>
                $data['payer_email'] ?? null,

            'payer_status' =>
                $data['payer_status'] ?? null,

            'status' =>
                $data['status'] ?? 'pending',

            'raw_response' => $data['raw_response'] ?? null,
        ]);
    }

    /**
     * ==========================================
     *  MARK PAYMENT AS COMPLETED
     * ==========================================
     */
    public function markAsCompleted(
        PaymentsSubscription $payment,
        string $transactionId = null
    ): PaymentsSubscription {
        $payment->update([
            'status' => 'completed',
            'transaction_id' => $transactionId,
        ]);

        return $payment;
    }

    /**
     * ==========================================
     *  MARK PAYMENT FAILED
     * ==========================================
     */
    public function markAsFailed(
        PaymentsSubscription $payment,
        string $reason = null
    ): PaymentsSubscription {
        $payment->update([
            'status' => 'failed',
            'transaction_id' => $reason,
        ]);

        return $payment;
    }

    /**
     * ==========================================
     *  FULL TRANSACTION WRAPPER (SAFE FLOW)
     * ==========================================
     */
    public function processPayment(
        callable $callback
    ) {
        return DB::transaction(function () use ($callback) {
            try {
                return $callback($this);
            } catch (\Exception $e) {
                Log::error('PaymentService Error: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * ==========================================
     *  FIND PAYMENT BY PROVIDER ID
     * ==========================================
     */
    public function findByProviderId(string $provider, string $providerId)
    {
        return PaymentProviderPayment::where('provider', $provider)
            ->where('provider_payment_id', $providerId)
            ->first();
    }
}