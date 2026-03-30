<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\Product;
use App\Models\StatusService;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

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
            'status_id' => StatusService::factory(),
		    'date_entry' => now(),
        ];
    }
}
