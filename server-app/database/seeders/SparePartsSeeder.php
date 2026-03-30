<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class SparePartsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $DATA = [
            [
                'servi_id' => null,
                'user_id' => 1,
                'model' => 'model1',
                'brand' => 'brand1',
                'price' => 15000,
                'note' => 'La pieza.....'
            ],
            [
                'servi_id' => null,
                'user_id' => 1,
                'model' => 'model2',
                'brand' => 'brand2',
                'price' => 25000,
                'note' => '.....'
            ],

        ];
        DB::table('spare_parts')->insert($DATA);
    }
}
