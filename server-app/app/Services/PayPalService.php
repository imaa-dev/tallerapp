<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalService
{
    public function __construct()
    {
        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.client_secret');

        $mode = config('services.paypal.mode', 'sandbox');

        $this->baseUrl = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }


    /**
     * =========================
     *  ACCESS TOKEN
     * =========================
     */
    public function getAccessToken()
    {
        // generar token y devolverlo para usarlo 
         try {
            $response = Http::asForm()
                ->withBasicAuth($this->clientId, $this->clientSecret)
                ->post("{$this->baseUrl}/v1/oauth2/token", [
                    'grant_type' => 'client_credentials',
                ]);

            if (!$response->successful()) {
                Log::error('PayPal Token Error', $response->json());
                return null;
            }

            return $response->json()['access_token'];
        } catch (\Exception $e) {
            Log::error('PayPal Token Exception: ' . $e->getMessage());
            return null;
        }
    }
    /**
     * =========================
     *  CREATE SUBSCRIPTION
     * =========================
     */
    public function createSubscription(string $planId, string $returnUrl, string $cancelUrl): ?array
    {
        $token = $this->getAccessToken();
        
        if (!$token) {
            return null;
        }

        try {
            $response = Http::withToken($token)
                ->post("{$this->baseUrl}/v1/billing/subscriptions", [
                    'plan_id' => $planId,
                    'application_context' => [
                        'return_url' => $returnUrl,
                        'cancel_url' => $cancelUrl,
                        'user_action' => 'SUBSCRIBE_NOW',
                    ],
                ]);
            
            if (!$response->successful()) {
                Log::error('PayPal Create Subscription Error', $response->json());
                return null;
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('PayPal Create Subscription Exception: ' . $e->getMessage());
            return null;
        }
    }
        /**
     * =========================
     *  GET SUBSCRIPTION INFO
     * =========================
     */
    public function getSubscription(string $subscriptionId): ?array
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return null;
        }

        try {
            $response = Http::withToken($token)
                ->get("{$this->baseUrl}/v1/billing/subscriptions/{$subscriptionId}");

            if (!$response->successful()) {
                Log::error('PayPal Get Subscription Error', $response->json());
                return null;
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('PayPal Get Subscription Exception: ' . $e->getMessage());
            return null;
        }
    }
    /**
     * =========================
     *  CAPTURE PAYMENT (SUBSCRIPTION)
     * =========================
     * Nota: PayPal NO "captura" manual como checkout clásico.
     * Las suscripciones se confirman vía:
     * - status ACTIVE
     * - webhooks
     * - o billing cycles automáticos
     */
    public function activateSubscription(string $subscriptionId): ?array
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return null;
        }

        try {
            $response = Http::withToken($token)
                ->post("{$this->baseUrl}/v1/billing/subscriptions/{$subscriptionId}/activate", []);

            if (!$response->successful()) {
                Log::error('PayPal Activate Subscription Error', $response->json());
                return null;
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('PayPal Activate Subscription Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * =========================
     *  CANCEL SUBSCRIPTION
     * =========================
     */
    public function cancelSubscription(string $subscriptionId, string $reason = 'User requested'): bool
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return false;
        }

        try {
            $response = Http::withToken($token)
                ->post("{$this->baseUrl}/v1/billing/subscriptions/{$subscriptionId}/cancel", [
                    'reason' => $reason,
                ]);

            if (!$response->successful()) {
                Log::error('PayPal Cancel Subscription Error', $response->json());
                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('PayPal Cancel Subscription Exception: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * =========================
     *  WEBHOOK VALIDATION (IMPORTANTE)
     * =========================
     */
    public function verifyWebhook(array $headers, array $body): bool
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return false;
        }

        try {
            $response = Http::withToken($token)
                ->post("{$this->baseUrl}/v1/notifications/verify-webhook-signature", [
                    'auth_algo' => $headers['paypal-auth-algo'] ?? '',
                    'cert_url' => $headers['paypal-cert-url'] ?? '',
                    'transmission_id' => $headers['paypal-transmission-id'] ?? '',
                    'transmission_sig' => $headers['paypal-transmission-sig'] ?? '',
                    'transmission_time' => $headers['paypal-transmission-time'] ?? '',
                    'webhook_id' => config('services.paypal.webhook_id'),
                    'webhook_event' => $body,
                ]);

            return $response->successful()
                && ($response->json()['verification_status'] ?? '') === 'SUCCESS';
        } catch (\Exception $e) {
            Log::error('PayPal Webhook Verify Exception: ' . $e->getMessage());
            return false;
        }
    }
}