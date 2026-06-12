<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $DATA = [
            [
                'user_id' => 1,
                'name' => 'MyBike Norte',
                'description' => 'Taller de bicis',

            ],
            [
                'user_id' => 1,
                'name' => 'MyBike Sur',
                'description' => 'Taller de bicis',
            ],
            [
                'user_id' => 2,
                'name' => 'TallerBike',
                'description' => 'Taller de bicis',
            ],

        ];
        DB::table('organizations')->insert($DATA);
    }
}
