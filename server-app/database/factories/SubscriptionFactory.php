<?php

namespace Database\Factories;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\SubscriptionStatus;
use App\Models\Organization;
use App\Models\Plan;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'provider' => 'paypal',
            'provider_subscription_id' => fake()->uuid(),
            'provider_customer_id' => fake()->uuid(),
            'provider_metadata' => [],

            'starts_at' => now(),
            'ends_at' => now()->addMonth(),

            'status' => SubscriptionStatus::Active,
        ];
    }
}
