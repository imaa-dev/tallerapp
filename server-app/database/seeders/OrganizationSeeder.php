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
                'name' => 'IMAA',
                'description' => 'Empresa de desarrollo de software',
                'active' => true,
            ],
        ];
        DB::table('organizations')->insert($DATA);
    }
}
