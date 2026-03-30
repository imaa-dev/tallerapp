<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Free',
            'price' => 0,
            'interval' => 'monthly',
            'duration_days' => 30,
            'features' => 'Acceso básico a funciones del taller y tienda.',
        ]);

        Plan::create([
            'name' => 'Premium',
            'price' => 10.000,
            'interval' => 'monthly',
            'duration_days' => 30,
            'features' => 'Acceso completo, chat entre clientes, soporte técnico y más.',
        ]);
    }
}
