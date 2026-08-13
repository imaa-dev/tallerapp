<?php

namespace App\Services;

use App\Enums\SubscriptionProvider;
use App\Enums\SubscriptionStatus;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use App\Models\WebhooksEvent;
use App\Payments\Contracts\PaymentGateway;
use App\Payments\Exceptions\WebhookVerificationFailed;
use App\Payments\MercadoPagoGateway;
use App\Payments\PayPalGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function gateway(string $provider): PaymentGateway
    {
        return match ($provider) {
            SubscriptionProvider::PAYPAL->value => new PayPalGateway(
                clientId: config('services.paypal.client_id'),
                clientSecret: config('services.paypal.client_secret'),
                mode: config('services.paypal.mode', 'sandbox'),
                webhookId: config('services.paypal.webhook_id'),
            ),
            SubscriptionProvider::MERCADOPAGO->value => new MercadoPagoGateway(
                accessToken: config('services.mercadopago.access_token'),
                webhookSecret: config('services.mercadopago.webhook_secret'),
            ),
            default => throw new \InvalidArgumentException("Proveedor de pago no soportado: {$provider}"),
        };
    }

    public function createSubscription(
        string $provider,
        Plan $plan,
        Subscription $subscription,
        string $returnUrl,
        string $cancelUrl,
        array $customer = [],
    ): array {
        return $this->gateway($provider)->createSubscription($plan, [
            'return_url' => $returnUrl,
            'cancel_url' => $cancelUrl,
            'notification_url' => url('/api/mercadopago/webhook'),
            'external_reference' => 'org-'.$subscription->organization_id,
            'payer_email' => $customer['payer_email'] ?? null,
        ]);
    }

    public function cancelSubscription(Subscription $subscription): bool
    {
        if (! $subscription->provider || ! $subscription->provider_subscription_id) {
            return false;
        }

        $cancelled = $this->gateway($subscription->provider)
            ->cancelSubscription($subscription->provider_subscription_id);

        if ($cancelled) {
            $subscription->update(['status' => SubscriptionStatus::Cancelled]);
        }

        return $cancelled;
    }

    public function verifyAndProcessWebhook(string $provider, array $headers, array $payload): void
    {
        $gateway = $this->gateway($provider);

        if (! $gateway->verifyWebhook($headers, $payload)) {
            throw new WebhookVerificationFailed('Firma de webhook inválida.');
        }

        $event = $gateway->parseWebhookEvent($payload);

        if (! $event || $event['type'] === 'ignored') {
            return;
        }

        $webhookEvent = WebhooksEvent::firstOrCreate(
            ['provider' => $provider, 'event_id' => $event['event_id']],
            [
                'event_type' => $event['type'],
                'resource_id' => $event['provider_subscription_id'],
                'payload' => $payload,
            ],
        );

        if (! $webhookEvent->wasRecentlyCreated) {
            return;
        }

        DB::transaction(function () use ($provider, $event, $webhookEvent) {
            $this->applyEvent($provider, $event);
            $webhookEvent->update(['processed_at' => now()]);
        });
    }

    private function applyEvent(string $provider, array $event): void
    {
        $subscription = $this->findSubscription($provider, $event['provider_subscription_id']);

        if (! $subscription) {
            Log::warning('Webhook: suscripción no encontrada', $event);

            return;
        }

        switch ($event['type']) {
            case 'activated':
                $subscription->update([
                    'status' => SubscriptionStatus::Active,
                    'starts_at' => now(),
                    'ends_at' => $event['paid_at']
                        ? now()->parse($event['paid_at'])
                        : $this->nextPeriodEnd($subscription),
                ]);
                break;

            case 'renewal':
                $this->recordPayment($provider, $subscription, $event, SubscriptionPayment::STATUS_COMPLETED);
                $this->renewSubscription($subscription);
                break;

            case 'payment_failed':
                if ($event['provider_payment_id']) {
                    $this->recordPayment($provider, $subscription, $event, SubscriptionPayment::STATUS_FAILED);
                }
                $subscription->update(['status' => SubscriptionStatus::Suspended]);
                break;

            case 'cancelled':
                $subscription->update(['status' => SubscriptionStatus::Cancelled]);
                break;

            case 'suspended':
                $subscription->update(['status' => SubscriptionStatus::Suspended]);
                break;

            case 'expired':
                $subscription->update(['status' => SubscriptionStatus::Expired]);
                break;

            case 'refunded':
                if ($event['provider_payment_id']) {
                    $this->recordPayment($provider, $subscription, $event, SubscriptionPayment::STATUS_REFUNDED);
                }
                break;
        }
    }

    private function findSubscription(string $provider, ?string $providerSubscriptionId): ?Subscription
    {
        if (! $providerSubscriptionId) {
            return null;
        }

        return Subscription::query()
            ->where('provider', $provider)
            ->where('provider_subscription_id', $providerSubscriptionId)
            ->first();
    }

    private function recordPayment(
        string $provider,
        Subscription $subscription,
        array $event,
        string $status,
    ): SubscriptionPayment {
        return SubscriptionPayment::updateOrCreate(
            [
                'provider' => $provider,
                'provider_payment_id' => $event['provider_payment_id'],
            ],
            [
                'subscription_id' => $subscription->id,
                'provider_capture_id' => $event['provider_capture_id'],
                'payer_id' => $event['payer_id'],
                'amount' => $event['amount'] ?? 0,
                'currency' => $event['currency'] ?? 'USD',
                'status' => $status,
                'paid_at' => $event['paid_at'] ? now()->parse($event['paid_at']) : now(),
            ],
        );
    }

    private function renewSubscription(Subscription $subscription): void
    {
        $subscription->ends_at = $this->nextPeriodEnd($subscription);
        $subscription->status = SubscriptionStatus::Active;
        $subscription->save();
    }

    private function nextPeriodEnd(Subscription $subscription): \Carbon\Carbon
    {
        $base = $subscription->ends_at && $subscription->ends_at->isFuture()
            ? $subscription->ends_at
            : now();

        return $subscription->plan->billing_period === 'year'
            ? $base->copy()->addYear()
            : $base->copy()->addMonth();
    }
}
