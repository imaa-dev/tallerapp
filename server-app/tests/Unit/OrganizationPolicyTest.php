<?php

namespace Tests\Unit;

use App\Enums\SubscriptionStatus;
use App\Models\Organization;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Policies\OrganizationPolicy;
use Database\Seeders\PlanSeeder;
use Tests\TestCase;

class OrganizationPolicyTest extends TestCase
{
    public function test_trial_subscription_allows_create_service()
    {
        dump([
            'database' => config('database.connections.mysql.database'),
            'host' => config('database.connections.mysql.host'),
        ]);
        $this->seed(PlanSeeder::class);
        $user = User::factory()
            ->admin()
            ->create();

        $organization = Organization::factory()->create([
            'user_id' => $user->id,
        ]);

        $plan = Plan::where('name', 'Profesional')->first();
        Subscription::factory()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => SubscriptionStatus::Trial,
        ]);

        $policy = app(OrganizationPolicy::class);

        $this->assertTrue(
            $policy->createService(
                $user,
                $organization
            )
        );
    }

    public function test_expired_trial_subscription_denies_create_service_and_updates_status()
    {
        $this->seed(PlanSeeder::class);
        $user = User::factory()
            ->admin()
            ->create();

        $organization = Organization::factory()->create([
            'user_id' => $user->id,
        ]);

        $plan = Plan::where('name', 'Profesional')->first();
        $subscription = Subscription::factory()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => SubscriptionStatus::Trial,
            'ends_at' => now()->subDay(),
        ]);

        $policy = app(OrganizationPolicy::class);

        $this->assertFalse(
            $policy->createService(
                $user,
                $organization
            )
        );

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => SubscriptionStatus::Expired->value,
        ]);
    }
}
