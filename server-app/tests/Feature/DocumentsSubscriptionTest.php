<?php

namespace Tests\Feature;

use App\Enums\SubscriptionStatus;
use App\Models\Organization;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DocumentsSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    private function makeOrganizationWithSubscription(string $status, ?string $endsAt = null): array
    {
        $this->seed(PlanSeeder::class);

        $admin = User::factory()->admin()->create();

        $organization = Organization::factory()->create([
            'user_id' => $admin->id,
        ]);

        $plan = Plan::where('name', 'Profesional')->first();

        Subscription::factory()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => $status,
            'ends_at' => $endsAt,
        ]);

        return [$admin, $organization];
    }

    public function test_documents_view_is_blocked_when_subscription_is_expired(): void
    {
        [$admin, $organization] = $this->makeOrganizationWithSubscription(
            SubscriptionStatus::Expired->value
        );

        $response = $this->actingAs($admin)
            ->withSession(['tenant_id' => $organization->id])
            ->get(route('repair.documents.view'));

        $response->assertStatus(302);
        $response->assertSessionHas('error_code', 'ORGANIZATION_EXPIRED');
    }

    public function test_documents_view_is_blocked_when_subscription_is_pending_payment(): void
    {
        [$admin, $organization] = $this->makeOrganizationWithSubscription(
            SubscriptionStatus::Pending->value
        );

        $response = $this->actingAs($admin)
            ->withSession(['tenant_id' => $organization->id])
            ->get(route('repair.documents.view'));

        $response->assertStatus(302);
        $response->assertSessionHas('error_code', 'ORGANIZATION_PAYMENT_PENDING');
    }

    public function test_documents_view_is_blocked_when_trial_has_expired(): void
    {
        [$admin, $organization] = $this->makeOrganizationWithSubscription(
            SubscriptionStatus::Trial->value,
            now()->subDay()->toDateTimeString()
        );

        $response = $this->actingAs($admin)
            ->withSession(['tenant_id' => $organization->id])
            ->get(route('repair.documents.view'));

        $response->assertStatus(302);
        $response->assertSessionHas('error_code', 'ORGANIZATION_EXPIRED');

        $this->assertDatabaseHas('subscriptions', [
            'id' => $organization->subscription->id,
            'status' => SubscriptionStatus::Expired->value,
        ]);
    }

    public function test_documents_view_allows_active_subscription(): void
    {
        [$admin, $organization] = $this->makeOrganizationWithSubscription(
            SubscriptionStatus::Active->value,
            now()->addMonth()->toDateTimeString()
        );

        $response = $this->actingAs($admin)
            ->withSession(['tenant_id' => $organization->id])
            ->get(route('repair.documents.view'));

        $response->assertOk();
    }
}
