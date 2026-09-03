<?php

namespace App\Payments\Contracts;

use App\Models\Plan;

interface PaymentGateway
{
    public function name(): string;

    /**
     * @return array{provider_subscription_id: string, approve_url: string}
     */
    public function createSubscription(Plan $plan, array $options): array;

    public function cancelSubscription(string $providerSubscriptionId): bool;

    public function getSubscription(string $providerSubscriptionId): ?array;

    public function verifyWebhook(array $headers, array $payload, string $rawPayload,): bool;

    /**
     * Convierte el payload crudo del proveedor a un evento normalizado.
     *
     * @return array{
     *     event_id: string,
     *     type: 'activated'|'renewal'|'cancelled'|'suspended'|'expired'|'payment_failed'|'refunded'|'ignored',
     *     provider_subscription_id: string|null,
     *     provider_payment_id: string|null,
     *     provider_capture_id: string|null,
     *     payer_id: string|null,
     *     amount: float|null,
     *     currency: string|null,
     *     paid_at: string|null,
     * }|null
     */
    public function parseWebhookEvent(array $payload): ?array;
}
