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
        $petugasUsers = [
            [
                'name' => 'Budi Arie',
                'email' => 'petugas@petirpay.id',
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
    }
}
