<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use App\Models\Penggunaan;
use App\Models\Tagihan;
use Illuminate\Database\Seeder;

class TagihanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $penggunaanRecords = Penggunaan::with('pelanggan.tarif')->get();

        foreach ($penggunaanRecords as $penggunaan) {
            $pelanggan = $penggunaan->pelanggan;

            if (!$pelanggan || !$pelanggan->tarif) {
                continue;
            }

            // Calculate kwh terpakai
            $kwhTerpakai = $penggunaan->meter_akhir - $penggunaan->meter_awal;
            $kwhTerpakai = max(0, $kwhTerpakai);


            Tagihan::create([
                'id_pelanggan' => $pelanggan->id,
                'id_penggunaan' => $penggunaan->id,
                'bulan' => $penggunaan->bulan,
                'tahun' => $penggunaan->tahun,
                'jumlah_meter' => $kwhTerpakai,
                'status' => $this->getRandomStatus(),
                'created_at' => $penggunaan->created_at,
                'updated_at' => $penggunaan->updated_at,
            ]);
        }
    }

    private function getRandomStatus(): string
    {
        $statuses = ['belum_bayar', 'menunggu_konfirmasi', 'lunas'];
        $weights = [40, 10, 50]; // 40% belum_bayar, 10% menunggu_konfirmasi, 50% lunas

        $random = rand(1, 100);
        $cumulative = 0;

        foreach ($weights as $index => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $statuses[$index];
            }
        }

        return 'belum_bayar';
    }
}
