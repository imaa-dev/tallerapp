<?php

namespace Database\Seeders;

use App\Models\MotorWorkCategory;
use Illuminate\Database\Seeder;

class MotorWorkCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Forestal',
            'Jardinería y áreas verdes',
            'Agricultura',
            'Construcción y trabajo pesado',
            'Otros equipos',
        ];

        foreach ($categories as $name) {
            MotorWorkCategory::firstOrCreate(['name' => $name]);
        }
    }
}
