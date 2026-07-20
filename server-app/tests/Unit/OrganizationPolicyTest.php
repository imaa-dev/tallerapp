<?php

namespace Tests\Unit;

use App\Models\Plan;
use Database\Seeders\PlanSeeder;
use Tests\TestCase;
use App\Models\User;
use App\Models\Organization;
use App\Models\Subscription;
use App\Policies\OrganizationPolicy;
use App\Enums\SubscriptionStatus;

class OrganizationPolicyTest extends TestCase
{
    public function test_trial_subscription_allows_create_service()
    {
        $this->seed(PlanSeeder::class);
        $user = User::factory()
            ->admin()
            ->create();

        $organization = Organization::factory()->create([
            'user_id' => $user->id,
        ]);

        $plan = Plan::where('name', 'Free')->first();
        Subscription::factory()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => SubscriptionStatus::Trial,
        ]);


        $policy = new OrganizationPolicy();


        $this->assertTrue(
            $policy->createService(
                $user,
                $organization
            )
        );
    }
}
