<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some regular petugas users (field officers)
        $petugasUsers = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ahmad Rahman',
                'email' => 'ahmad.rahman@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Dewi Kusuma',
                'email' => 'dewi.kusuma@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Rudi Hermawan',
                'email' => 'rudi.hermawan@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'maya.sari@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Hendro Wijaya',
                'email' => 'hendro.wijaya@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Rina Kartika',
                'email' => 'rina.kartika@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'petugas',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($petugasUsers as $userData) {
            User::create($userData);
        }


        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@petirpay.id',
            'password' => bcrypt('password'),
            'role' => 'administrator',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Manager',
            'email' => 'manager@petirpay.id',
            'password' => bcrypt('password'),
            'role' => 'administrator',
            'email_verified_at' => now(),
        ]);
    }
}
