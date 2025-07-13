<?php

namespace Database\Seeders;

use App\Models\Penggunaan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PenggunaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $penggunaan = [];


        for ($pelangganId = 1; $pelangganId <= 8; $pelangganId++) {
            for ($bulan = 1; $bulan <= 6; $bulan++) {
                $meteranAwal = rand(1000, 5000);
                $meteranAkhir = $meteranAwal + rand(100, 500);

                $penggunaan[] = [
                    'id_pelanggan' => $pelangganId,
                    'bulan' => $bulan,
                    'tahun' => 2024,
                    'meter_awal' => $meteranAwal,
                    'meter_akhir' => $meteranAkhir,
                    'created_at' => now()->subMonths(6 - $bulan),
                    'updated_at' => now()->subMonths(6 - $bulan),
                ];
            }
        }

        for ($pelangganId = 1; $pelangganId <= 8; $pelangganId++) {
            $meteranAwal = rand(5000, 8000);
            $meteranAkhir = $meteranAwal + rand(120, 400);

            $penggunaan[] = [
                'id_pelanggan' => $pelangganId,
                'bulan' => 7,
                'tahun' => 2024,
                'meter_awal' => $meteranAwal,
                'meter_akhir' => $meteranAkhir,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach ($penggunaan as $data) {
            Penggunaan::create($data);
        }
    }
}
