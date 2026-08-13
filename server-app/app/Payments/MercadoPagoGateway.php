<?php

namespace App\Payments;

use App\Models\Plan;
use App\Payments\Contracts\PaymentGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MercadoPagoGateway implements PaymentGateway
{
    protected const BASE_URL = 'https://api.mercadopago.com';

    public function __construct(
        protected string $accessToken,
        protected string $webhookSecret,
    ) {}

    public function name(): string
    {
        return 'mercadoPago';
    }

    public function createSubscription(Plan $plan, array $options): array
    {
        $planId = $plan->providerPlanId($this->name());

        if (! $planId) {
            $planId = $this->createPreapprovalPlan($plan, $options);
            $plan->setProviderPlanId($this->name(), $planId);
        }

        $preapproval = $this->request('post', '/preapproval', [
            'preapproval_plan_id' => $planId,
            'reason' => $plan->name,
            'external_reference' => $options['external_reference'] ?? null,
            'payer_email' => $options['payer_email'] ?? null,
            'back_url' => $options['return_url'] ?? null,
            'notification_url' => $options['notification_url'] ?? null,
        ]);

        $approveUrl = $preapproval['init_point'] ?? null;

        if (! $approveUrl) {
            throw new \RuntimeException('MercadoPago no devolvió init_point.');
        }

        return [
            'provider_subscription_id' => $preapproval['id'],
            'approve_url' => $approveUrl,
        ];
    }

    public function cancelSubscription(string $providerSubscriptionId): bool
    {
        try {
            $this->request('post', "/preapproval/{$providerSubscriptionId}", [
                'status' => 'cancelled',
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('MercadoPago Cancel Subscription Exception: '.$e->getMessage());

            return false;
        }
    }

    public function getSubscription(string $providerSubscriptionId): ?array
    {
        try {
            return $this->request('get', "/preapproval/{$providerSubscriptionId}");
        } catch (\Throwable $e) {
            Log::error('MercadoPago Get Subscription Exception: '.$e->getMessage());

            return null;
        }
    }

    public function verifyWebhook(array $headers, array $payload): bool
    {
        $signature = $headers['x-signature'][0] ?? '';

        if (! $signature) {
            return false;
        }

        parse_str($signature, $parts);

        $ts = $parts['ts'] ?? null;
        $v1 = $parts['v1'] ?? null;

        if (! $ts || ! $v1) {
            return false;
        }

        $dataId = $payload['data']['id'] ?? null;
        $dataType = $payload['type'] ?? null;

        if (! $dataId || ! $dataType) {
            return false;
        }

        $manifest = "id:{$dataId};type:{$dataType};ts:{$ts};";

        $expected = hash_hmac('sha256', $manifest, $this->webhookSecret);

        return hash_equals($expected, $v1);
    }

    public function parseWebhookEvent(array $payload): ?array
    {
        $action = $payload['action'] ?? null;
        $type = $payload['type'] ?? null;
        $dataId = $payload['data']['id'] ?? null;

        if (! $dataId) {
            return null;
        }

        $event = [
            'event_id' => $payload['id'] ?? md5(json_encode($payload)),
            'type' => 'ignored',
            'provider_subscription_id' => null,
            'provider_payment_id' => null,
            'provider_capture_id' => null,
            'payer_id' => null,
            'amount' => null,
            'currency' => null,
            'paid_at' => null,
        ];

        switch ($action) {
            case 'subscription_created':
            case 'subscription_updated':
                $event['type'] = 'activated';
                $event['provider_subscription_id'] = $dataId;
                $this->hydratePreapproval($event);
                break;

            case 'subscription_cancelled':
                $event['type'] = 'cancelled';
                $event['provider_subscription_id'] = $dataId;
                break;

            case 'subscription_paused':
                $event['type'] = 'suspended';
                $event['provider_subscription_id'] = $dataId;
                break;

            case 'subscription_authorized_payment':
            case 'payment.created':
            case 'payment.updated':
                $this->hydratePayment($event, $dataId);
                break;

            default:
                if ($type === 'subscription_authorized_payment') {
                    $this->hydratePayment($event, $dataId);

                    return $event;
                }

                $event['type'] = 'ignored';
        }

        return $event;
    }

    private function hydratePreapproval(array &$event): void
    {
        $preapproval = $this->getSubscription($event['provider_subscription_id']);

        if (! $preapproval) {
            return;
        }

        $event['paid_at'] = $preapproval['next_payment_date']
            ?? $preapproval['start_date']
            ?? null;
    }

    private function hydratePayment(array &$event, string $paymentId): void
    {
        $payment = $this->getPayment($paymentId);

        if (! $payment) {
            $event['type'] = 'payment_failed';

            return;
        }

        $event['provider_payment_id'] = $paymentId;
        $event['provider_subscription_id'] = $payment['preapproval_id'] ?? null;
        $event['payer_id'] = $payment['payer']['id'] ?? null;
        $event['amount'] = (float) ($payment['transaction_amount'] ?? 0);
        $event['currency'] = $payment['currency_id'] ?? null;
        $event['paid_at'] = $payment['date_approved'] ?? $payment['date_created'] ?? null;

        $status = $payment['status'] ?? null;

        $event['type'] = match ($status) {
            'approved' => 'renewal',
            'rejected', 'cancelled', 'refunded', 'charged_back' => 'payment_failed',
            default => 'payment_failed',
        };
    }

    private function createPreapprovalPlan(Plan $plan, array $options): string
    {
        [$frequency, $frequencyType] = $this->frequency($plan);

        $response = $this->request('post', '/preapproval_plan', [
            'reason' => $plan->name,
            'back_url' => $options['return_url'] ?? null,
            'notification_url' => $options['notification_url'] ?? null,
            'auto_recurring' => [
                'frequency' => $frequency,
                'frequency_type' => $frequencyType,
                'transaction_amount' => $plan->price,
                'currency_id' => 'USD',
            ],
        ]);

        $planId = $response['id'] ?? null;

        if (! $planId) {
            throw new \RuntimeException('MercadoPago no devolvió el id del preapproval_plan.');
        }

        return $planId;
    }

    private function getPayment(string $paymentId): ?array
    {
        try {
            return $this->request('get', "/v1/payments/{$paymentId}");
        } catch (\Throwable $e) {
            Log::error('MercadoPago Get Payment Exception: '.$e->getMessage());

            return null;
        }
    }

    private function frequency(Plan $plan): array
    {
        return match ($plan->billing_period) {
            'year' => [1, 'years'],
            default => [1, 'months'],
        };
    }

    private function request(string $method, string $path, array $body = []): array
    {
        $response = Http::withToken($this->accessToken)
            ->acceptJson()
            ->{$method}(self::BASE_URL.$path, $body);

        if (! $response->successful()) {
            Log::error('MercadoPago Request Error', $response->json());
            throw new \RuntimeException(
                'MercadoPago error: '.($response->json()['message'] ?? 'request fallida')
            );
        }

        return $response->json();
    }
}
