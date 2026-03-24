<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $DATA = [
            [
                'name' => 'Mauricio',
                'email' => 'imaa.desarrollo@gmail.com',
                'email_verified_at' => now(),
                'phone' => '+56982198976',
                'password' => Hash::make('qwerty123'),
                'rol' => 'ADMIN'
            ],
        ];
        DB::table('users')->insert($DATA);
    }
}
