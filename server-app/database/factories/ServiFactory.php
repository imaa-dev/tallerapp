<?php

namespace Database\Factories;

use App\Enums\ServiceStatus;
use App\Models\Organization;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Servi>
 */
class ServiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'user_id' => User::factory(),
            'organization_id' => Organization::factory(),
            'product_id' => Product::factory(),
            'status_id' => ServiceStatus::Reception->value,
            'date_entry' => now(),
        ];
    }
}
