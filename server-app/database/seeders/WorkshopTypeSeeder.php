<?php

namespace Database\Seeders;

use App\Models\WorkshopType;
use Illuminate\Database\Seeder;

class WorkshopTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'Taller mecánico',
            'Taller de bicicletas',
            'Taller de electrónica y celulares',
            'Taller de maquinaria pesada',
            'Taller de maquinaria general y equipos',
        ];

        foreach ($types as $name) {
            WorkshopType::firstOrCreate(['name' => $name]);
        }
    }
}
