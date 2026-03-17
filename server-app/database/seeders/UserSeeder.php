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
            [
                'name' => 'Alejandro',
                'email' => 'alejandro@gmail.com',
                'email_verified_at' => now(),
                'phone' => '+56999887766',
                'password' => Hash::make('qwerty123'),
                'rol' => 'CLIENT'
            ],
            [
                'name' => 'Alejandro',
                'email' => 'alejandro@mail.com',
                'email_verified_at' => now(),
                'phone' => '+56999887766',
                'password' => Hash::make('qwerty123'),
                'rol' => 'SELLER'
            ],
            [
                'name' => 'Jona',
                'email' => 'jona@gmail.com',
                'email_verified_at' => now(),
                'phone' => '+56993779161',
                'password' => Hash::make('qwerty123'),
                'rol' => 'TECHNICIAN'
            ],
        ];
        DB::table('users')->insert($DATA);
    }
}
