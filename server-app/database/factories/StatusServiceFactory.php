<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StatusService>
 */
class StatusServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                'RECEPCIONADO',
                'DIAGNOSTICO',
                'APROVACION_REPUESTO',
                'EN_REPARACION',
                'REPARADO',
                'ENTREGADO',
                'INCIDENCIA',
            ])
        ];
    }
}
