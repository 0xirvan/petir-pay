<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pelanggan = [
            [
                'nama' => 'John Doe',
                'email' => 'john.doe@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Merdeka No. 123, Jakarta Pusat',
                'nomor_meter' => 'MTR001234567890',
                'id_tarif' => 1, // Asumsi tarif dengan ID 1 sudah ada
            ],
            [
                'nama' => 'Jane Smith',
                'email' => 'jane.smith@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Sudirman No. 456, Jakarta Selatan',
                'nomor_meter' => 'MTR001234567891',
                'id_tarif' => 2,
            ],
            [
                'nama' => 'Bob Johnson',
                'email' => 'bob.johnson@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Gatot Subroto No. 789, Jakarta Barat',
                'nomor_meter' => 'MTR001234567892',
                'id_tarif' => 1,
            ],
            [
                'nama' => 'Alice Brown',
                'email' => 'alice.brown@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Thamrin No. 321, Jakarta Pusat',
                'nomor_meter' => 'MTR001234567893',
                'id_tarif' => 3,
            ],
            [
                'nama' => 'Charlie Davis',
                'email' => 'charlie.davis@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Kuningan No. 654, Jakarta Selatan',
                'nomor_meter' => 'MTR001234567894',
                'id_tarif' => 2,
            ],
            [
                'nama' => 'Diana Wilson',
                'email' => 'diana.wilson@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Menteng No. 987, Jakarta Pusat',
                'nomor_meter' => 'MTR001234567895',
                'id_tarif' => 1,
            ],
            [
                'nama' => 'Eva Martinez',
                'email' => 'eva.martinez@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Kemang No. 147, Jakarta Selatan',
                'nomor_meter' => 'MTR001234567896',
                'id_tarif' => 3,
            ],
            [
                'nama' => 'Frank Miller',
                'email' => 'frank.miller@email.com',
                'password' => Hash::make('password123'),
                'alamat' => 'Jl. Senayan No. 258, Jakarta Pusat',
                'nomor_meter' => 'MTR001234567897',
                'id_tarif' => 2,
            ],
        ];

        foreach ($pelanggan as $data) {
            Pelanggan::create($data);
        }
    }
}
