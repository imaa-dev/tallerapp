<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\PlanFeature;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $PLANS = [
            [
                'name' => 'Profesional',
                'slug' => 'profesional',
                'price' => 10.00,
                'description' => 'para empezar',
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'price' => 15.00,
                'description' => 'para crecer',
                'billing_period' => 'month',
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'slug' => 'premium',
                'price' => 20.00,
                'description' => 'sin limites',
                'billing_period' => 'month',
                'is_active' => true,
            ],
        ];

        foreach ($PLANS as $plan) {
            Plan::updateOrCreate(['name' => $plan['name']], $plan);
        }

        $FEATURES = [
            ['key' => 'max_users', 'name' => 'Usuarios', 'value' => '3', 'type' => 'integer'],
            ['key' => 'branded_pdf', 'name' => 'PDF con marca', 'value' => 'true', 'type' => 'boolean'],
            ['key' => 'whatsapp_web', 'name' => 'WhatsApp Web', 'value' => 'true', 'type' => 'boolean'],
            ['key' => 'max_vehicles', 'name' => 'Vehículos', 'value' => '100', 'type' => 'integer'],
            ['key' => 'technical_support', 'name' => 'Soporte técnico', 'value' => 'true', 'type' => 'boolean'],
            ['key' => 'cloud_storage', 'name' => 'Almacenamiento', 'value' => '5', 'type' => 'integer'],
        ];

        $profesional = Plan::where('slug', 'profesional')->firstOrFail();

        foreach ($FEATURES as $feature) {
            PlanFeature::updateOrCreate(
                ['plan_id' => $profesional->id, 'key' => $feature['key']],
                $feature
            );
        }
    }
}
