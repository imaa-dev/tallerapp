<?php

namespace Database\Seeders;

use App\Models\MotorWork;
use App\Models\MotorWorkCategory;
use App\Models\WorkshopType;
use Illuminate\Database\Seeder;

class MotorWorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workshopTypeId = WorkshopType::where('name', 'Taller de maquinaria general y equipos')->value('id');

        $categorized = [
            'Forestal' => [
                'Motosierras',
                'Podadoras de altura',
                'Desbrozadoras forestales',
                'Taladoras/desramadoras',
                'Astilladoras portátiles pequeñas con motor 2T',
                'Perforadoras forestales manuales',
                'Ahoyadoras / barrenos de tierra',
            ],
            'Jardinería y áreas verdes' => [
                'Desbrozadoras',
                'Orilladoras / bordeadoras',
                'Cortabordes',
                'Cortasetos',
                'Sopladores de hojas',
                'Aspiradores de hojas',
                'Podadoras de altura',
                'Pulverizadores de mochila',
                'Fumigadoras de mochila',
                'Nebulizadores',
                'Atomizadores',
                'Cortadoras de césped con motor 2T (menos comunes actualmente)',
            ],
            'Agricultura' => [
                'Motoguadañas',
                'Pulverizadores agrícolas de mochila',
                'Atomizadores agrícolas',
                'Ahoyadoras',
                'Motocultores pequeños (algunos modelos 2T)',
                'Bombas de fumigación',
                'Bombas de agua pequeñas',
                'Motores estacionarios pequeños 2T',
            ],
            'Construcción y trabajo pesado' => [
                'Vibropisones',
                'Compactadoras',
                'Placas vibratorias',
                'Generadores',
                'Bombas de agua',
                'Betoneras',
                'Cortadoras de concreto',
            ],
            'Otros equipos' => [
                'Generadores eléctricos pequeños',
                'Motobombas',
                'Hidrolavadoras a motor',
                'Compresores pequeños',
                'Bombas de agua',
                'Motores estacionarios',
                'Equipos de fumigación',
                'Equipos de pulverización',
                'Equipos de limpieza industrial',
                'Equipos de emergencia con motor',
                'Equipos con motor de combustión portátil',
            ],
        ];

        foreach ($categorized as $categoryName => $items) {
            $categoryId = MotorWorkCategory::where('name', $categoryName)->value('id');

            foreach ($items as $item) {
                MotorWork::firstOrCreate([
                    'workshop_type_id' => $workshopTypeId,
                    'motor_work_category_id' => $categoryId,
                    'name' => $item,
                ]);
            }
        }
    }
}
