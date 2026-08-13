<?php

namespace App\Payments;

use App\Models\Plan;
use App\Payments\Contracts\PaymentGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalGateway implements PaymentGateway
{
    protected string $baseUrl;

    public function __construct(
        protected string $clientId,
        protected string $clientSecret,
        string $mode,
        protected string $webhookId,
    ) {
        $this->baseUrl = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    public function name(): string
    {
        return 'paypal';
    }

    public function createSubscription(Plan $plan, array $options): array
    {
        $planId = $plan->providerPlanId($this->name())
            ?? throw new \InvalidArgumentException(
                "No existe plan de PayPal configurado para el plan {$plan->name}."
            );

        $response = $this->request('post', '/v1/billing/subscriptions', [
            'plan_id' => $planId,
            'application_context' => [
                'return_url' => $options['return_url'],
                'cancel_url' => $options['cancel_url'],
                'user_action' => 'SUBSCRIBE_NOW',
            ],
        ]);

        $approveUrl = collect($response['links'] ?? [])
            ->firstWhere('rel', 'approve')['href'] ?? null;

        if (! $approveUrl) {
            throw new \RuntimeException('PayPal no devolvió approve_url.');
        }

        return [
            'provider_subscription_id' => $response['id'],
            'approve_url' => $approveUrl,
        ];
    }

    public function cancelSubscription(string $providerSubscriptionId): bool
    {
        try {
            $this->request('post', "/v1/billing/subscriptions/{$providerSubscriptionId}/cancel", [
                'reason' => 'User requested',
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('PayPal Cancel Subscription Exception: '.$e->getMessage());

            return false;
        }
    }

    public function createPlan(Plan $plan): string
    {
        $existing = $plan->providerPlanId($this->name());

        if ($existing) {
            return $existing;
        }

        $productId = $this->ensureProduct($plan);

        $interval = $plan->billing_period === 'year' ? 'YEAR' : 'MONTH';

        $response = $this->request('post', '/v1/billing/plans', [
            'product_id' => $productId,
            'name' => $plan->name,
            'description' => $plan->description ?? $plan->name,
            'billing_cycles' => [[
                'frequency' => [
                    'interval_unit' => $interval,
                    'interval_count' => 1,
                ],
                'tenure_type' => 'REGULAR',
                'sequence' => 1,
                'total_cycles' => 0,
                'pricing_scheme' => [
                    'fixed_price' => [
                        'value' => number_format((float) $plan->price, 2, '.', ''),
                        'currency_code' => 'USD',
                    ],
                ],
            ]],
            'payment_preferences' => [
                'auto_bill_outstanding' => true,
                'payment_failure_threshold' => 3,
            ],
        ]);

        $planId = $response['id'] ?? null;

        if (! $planId) {
            throw new \RuntimeException('PayPal no devolvió el id del billing plan.');
        }

        $plan->setProviderPlanId($this->name(), $planId);

        return $planId;
    }

    private function ensureProduct(Plan $plan): string
    {
        $productName = $plan->name.' ('.config('app.name').')';

        if ($productId = $this->findProductByName($productName)) {
            return $productId;
        }

        $response = $this->request('post', '/v1/catalogs/products', [
            'name' => $productName,
            'description' => $plan->description ?? $plan->name,
            'type' => 'SERVICE',
            'category' => 'SOFTWARE',
        ]);

        $productId = $response['id'] ?? null;

        if (! $productId) {
            throw new \RuntimeException('PayPal no devolvió el id del producto.');
        }

        return $productId;
    }

    private function findProductByName(string $name): ?string
    {
        try {
            $response = $this->request('get', '/v1/catalogs/products?page_size=50');

            return collect($response['products'] ?? [])
                ->firstWhere('name', $name)['id'] ?? null;
        } catch (\Throwable $e) {
            Log::error('PayPal Find Product Exception: '.$e->getMessage());

            return null;
        }
    }

    public function getSubscription(string $providerSubscriptionId): ?array
    {
        try {
            return $this->request('get', "/v1/billing/subscriptions/{$providerSubscriptionId}");
        } catch (\Throwable $e) {
            Log::error('PayPal Get Subscription Exception: '.$e->getMessage());

            return null;
        }
    }

    public function verifyWebhook(array $headers, array $payload): bool
    {
        $header = fn (string $key) => $headers['paypal-'.$key][0] ?? $headers[$key][0] ?? '';

        try {
            $response = $this->request('post', '/v1/notifications/verify-webhook-signature', [
                'auth_algo' => $header('auth-algo'),
                'cert_url' => $header('cert-url'),
                'transmission_id' => $header('transmission-id'),
                'transmission_sig' => $header('transmission-sig'),
                'transmission_time' => $header('transmission-time'),
                'webhook_id' => $this->webhookId,
                'webhook_event' => $payload,
            ]);

            return ($response['verification_status'] ?? '') === 'SUCCESS';
        } catch (\Throwable $e) {
            Log::error('PayPal Webhook Verify Exception: '.$e->getMessage());

            return false;
        }
    }

    public function parseWebhookEvent(array $payload): ?array
    {
        $eventType = $payload['event_type'] ?? null;
        $resource = $payload['resource'] ?? [];

        if (! $eventType) {
            return null;
        }

        $event = [
            'event_id' => $payload['id'] ?? md5(json_encode($payload)),
            'type' => 'ignored',
            'provider_subscription_id' => $resource['id'] ?? null,
            'provider_payment_id' => null,
            'provider_capture_id' => null,
            'payer_id' => $resource['payer']['payer_info']['payer_id'] ?? null,
            'amount' => null,
            'currency' => null,
            'paid_at' => null,
        ];

        switch ($eventType) {
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                $event['type'] = 'activated';
                break;

            case 'PAYMENT.SALE.COMPLETED':
                $event['type'] = 'renewal';
                $event['provider_subscription_id'] = $resource['billing_agreement_id'] ?? null;
                $event['provider_payment_id'] = $resource['id'] ?? null;
                $event['provider_capture_id'] = $resource['sale_id'] ?? $resource['id'] ?? null;
                $event['amount'] = (float) ($resource['amount']['total'] ?? 0);
                $event['currency'] = $resource['amount']['currency'] ?? null;
                $event['paid_at'] = $resource['create_time'] ?? null;
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
                $event['type'] = 'cancelled';
                break;

            case 'BILLING.SUBSCRIPTION.SUSPENDED':
                $event['type'] = 'suspended';
                break;

            case 'BILLING.SUBSCRIPTION.EXPIRED':
                $event['type'] = 'expired';
                break;

            case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
            case 'PAYMENT.SALE.DENIED':
                $event['type'] = 'payment_failed';
                $event['provider_payment_id'] = $resource['id'] ?? null;
                break;

            case 'PAYMENT.SALE.REFUNDED':
                $event['type'] = 'refunded';
                $event['provider_payment_id'] = $resource['id'] ?? null;
                break;

            default:
                $event['type'] = 'ignored';
        }

        return $event;
    }

    private function request(string $method, string $path, array $body = []): array
    {
        $token = $this->getAccessToken();

        if (! $token) {
            throw new \RuntimeException('PayPal: no se pudo obtener access token.');
        }

        $response = Http::withToken($token)
            ->{$method}("{$this->baseUrl}{$path}", $body);

        if (! $response->successful()) {
            Log::error('PayPal Request Error', $response->json());
            throw new \RuntimeException(
                'PayPal error: '.($response->json()['message'] ?? 'request fallida')
            );
        }

        return $response->json();
    }

    private function getAccessToken(): ?string
    {
        try {
            $response = Http::asForm()
                ->withBasicAuth($this->clientId, $this->clientSecret)
                ->post("{$this->baseUrl}/v1/oauth2/token", [
                    'grant_type' => 'client_credentials',
                ]);

            if (! $response->successful()) {
                Log::error('PayPal Token Error', $response->json());

                return null;
            }

            return $response->json()['access_token'];
        } catch (\Exception $e) {
            Log::error('PayPal Token Exception: '.$e->getMessage());

            return null;
        }
    }
}
