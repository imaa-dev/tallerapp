<?php

namespace Tests\Feature;

use App\Enums\SubscriptionStatus;
use App\Models\Organization;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\SubscriptionPayment;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SubscriptionWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PlanSeeder::class);

        config()->set('services.paypal.client_id', 'test-client');
        config()->set('services.paypal.client_secret', 'test-secret');
        config()->set('services.paypal.webhook_id', 'test-webhook');
        config()->set('services.paypal.mode', 'sandbox');

        Http::fake([
            'https://api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
                'access_token' => 'fake-token',
            ]),
            'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature' => Http::response([
                'verification_status' => 'SUCCESS',
            ]),
        ]);
    }

    private function makeSubscription(Plan $plan): Subscription
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['user_id' => $user->id]);

        return Subscription::factory()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'provider' => 'paypal',
            'provider_subscription_id' => 'SUB-123',
            'status' => SubscriptionStatus::Pending,
        ]);
    }

    public function test_activation_webhook_activates_subscription(): void
    {
        $plan = Plan::where('name', 'Profesional')->firstOrFail();
        $subscription = $this->makeSubscription($plan);

        $this->postJson(route('webhook.paypal'), [
            'id' => 'WH-ACTIVATE-1',
            'event_type' => 'BILLING.SUBSCRIPTION.ACTIVATED',
            'resource' => ['id' => 'SUB-123'],
        ])->assertOk();

        $subscription->refresh();

        $this->assertEquals(SubscriptionStatus::Active, $subscription->status);
        $this->assertNotNull($subscription->starts_at);
        $this->assertNotNull($subscription->ends_at);
    }

    public function test_sale_completed_webhook_records_payment_and_renews(): void
    {
        $plan = Plan::where('name', 'Profesional')->firstOrFail();
        $subscription = $this->makeSubscription($plan);
        $subscription->update([
            'status' => SubscriptionStatus::Active,
            'starts_at' => now()->subMonth(),
            'ends_at' => now()->addDays(10),
        ]);

        $this->postJson(route('webhook.paypal'), [
            'id' => 'WH-SALE-1',
            'event_type' => 'PAYMENT.SALE.COMPLETED',
            'resource' => [
                'id' => 'PAY-100',
                'billing_agreement_id' => 'SUB-123',
                'sale_id' => 'CAP-100',
                'amount' => ['total' => '10.00', 'currency' => 'USD'],
                'create_time' => now()->toIso8601String(),
            ],
        ])->assertOk();

        $payment = SubscriptionPayment::where('provider_payment_id', 'PAY-100')->firstOrFail();

        $this->assertEquals('completed', $payment->status);
        $this->assertEquals(10.0, $payment->amount);
        $this->assertEquals('USD', $payment->currency);

        $subscription->refresh();
        $this->assertGreaterThan(now()->addDays(10), $subscription->ends_at);
    }

    public function test_webhook_is_idempotent(): void
    {
        $plan = Plan::where('name', 'Profesional')->firstOrFail();
        $this->makeSubscription($plan);

        $payload = [
            'id' => 'WH-SALE-2',
            'event_type' => 'PAYMENT.SALE.COMPLETED',
            'resource' => [
                'id' => 'PAY-200',
                'billing_agreement_id' => 'SUB-123',
                'sale_id' => 'CAP-200',
                'amount' => ['total' => '10.00', 'currency' => 'USD'],
                'create_time' => now()->toIso8601String(),
            ],
        ];

        $this->postJson(route('webhook.paypal'), $payload)->assertOk();
        $this->postJson(route('webhook.paypal'), $payload)->assertOk();

        $this->assertEquals(1, SubscriptionPayment::where('provider_payment_id', 'PAY-200')->count());
        $this->assertEquals(1, SubscriptionPayment::all()->count());
    }

    public function test_cancelled_webhook_cancels_subscription(): void
    {
        $plan = Plan::where('name', 'Profesional')->firstOrFail();
        $subscription = $this->makeSubscription($plan);

        $this->postJson(route('webhook.paypal'), [
            'id' => 'WH-CANCEL-1',
            'event_type' => 'BILLING.SUBSCRIPTION.CANCELLED',
            'resource' => ['id' => 'SUB-123'],
        ])->assertOk();

        $this->assertEquals(SubscriptionStatus::Cancelled, $subscription->refresh()->status);
    }
}
