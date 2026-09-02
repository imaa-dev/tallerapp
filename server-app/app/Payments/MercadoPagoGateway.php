<?php

namespace App\Payments;

use App\Models\Plan;
use App\Payments\Contracts\PaymentGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Enums\SubscriptionProvider;

class MercadoPagoGateway implements PaymentGateway
{
    protected const BASE_URL = 'https://api.mercadopago.com';

    public function __construct(
        protected string $accessToken,
        protected string $webhookSecret,
    ) {}

    public function name(): string
    {
        return SubscriptionProvider::MERCADOPAGO->value;
    }

    public function createSubscription(Plan $plan, array $options): array
    {
        [$frequency, $frequencyType] = $this->frequency($plan);

        $payerEmail = $options['payer_email'] ?? null;
        $returnUrl = $options['return_url'] ?? null;
        $externalReference = $options['external_reference'] ?? null;
        $transactionAmount = $options['transaction_amount'] ?? null;
        $currency = strtoupper($options['currency_id'] ?? 'CLP');

        if (! filter_var($payerEmail, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException(
                'El correo del pagador no es válido.'
            );
        }

        if (blank($externalReference)) {
            throw new \InvalidArgumentException(
                'La referencia externa de la suscripción es obligatoria.'
            );
        }

        if (blank($returnUrl)) {
            throw new \InvalidArgumentException(
                'La URL de retorno de Mercado Pago es obligatoria.'
            );
        }

        if (! is_numeric($transactionAmount) || (float) $transactionAmount <= 0) {
            throw new \InvalidArgumentException(
                'El precio de Mercado Pago no está configurado correctamente.'
            );
        }

        $transactionAmount = (float) $transactionAmount;

        /*
         * CLP no utiliza decimales.
         */
        if ($currency === 'CLP') {
            $transactionAmount = (int) round($transactionAmount);

            if ($transactionAmount < 950) {
                throw new \InvalidArgumentException(
                    'El precio mínimo permitido por Mercado Pago es de $950 CLP.'
                );
            }
        }

        $autoRecurring = [
            'frequency' => $frequency,
            'frequency_type' => $frequencyType,
            'transaction_amount' => $transactionAmount,
            'currency_id' => $currency,
        ];

        /*
         * end_date es opcional.
         * No se envía si la suscripción es indefinida.
         */
        if (filled($options['end_date'] ?? null)) {
            $autoRecurring['end_date'] = $options['end_date'];
        }

        $preapproval = $this->request('post', '/preapproval', [
            'reason' => $plan->name,
            'external_reference' => $externalReference,
            'payer_email' => $payerEmail,
            'auto_recurring' => $autoRecurring,
            'back_url' => $returnUrl,
            'status' => 'pending',
        ]);

        $subscriptionId = $preapproval['id'] ?? null;
        $approveUrl = $preapproval['init_point'] ?? null;

        if (blank($subscriptionId) || blank($approveUrl)) {
            Log::error('Mercado Pago no devolvió los datos esperados', [
                'plan_id' => $plan->id,
                'external_reference' => $externalReference,
                'has_subscription_id' => filled($subscriptionId),
                'has_init_point' => filled($approveUrl),
            ]);

            throw new \RuntimeException(
                'Mercado Pago no pudo generar el enlace de suscripción.'
            );
        }

        return [
            'provider_subscription_id' => $subscriptionId,
            'approve_url' => $approveUrl,
            'status' => $preapproval['status'] ?? 'pending',
            'provider_metadata' => $preapproval,
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
