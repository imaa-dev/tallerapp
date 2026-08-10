<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            WorkshopTypeSeeder::class,
            MotorWorkCategorySeeder::class,
            MotorWorkSeeder::class,
            UserSeeder::class,
            OrganizationSeeder::class,
            PlanSeeder::class,
            SparePartsSeeder::class,
            SubscriptionSeeder::class,
        ]);
    }
}
