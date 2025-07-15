<?php

namespace Database\Seeders;

use App\Models\MetodePembayaran;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MetodePembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $metodePembayaran = [
            [
                'nama' => 'Bank BCA',
                'kode' => 'BCA',
                'atas_nama' => 'PT. Petir Pay Indonesia',
                'nomor_rekening' => '1234567890',
                'biaya_admin' => 2500.00,
                'deskripsi' => 'Transfer melalui Bank BCA',
                'logo' => 'metode-pembayaran/bca-logo.svg',
                'is_aktif' => true,
            ],
            [
                'nama' => 'Bank Mandiri',
                'kode' => 'MANDIRI',
                'atas_nama' => 'PT. Petir Pay Indonesia',
                'nomor_rekening' => '9876543210',
                'biaya_admin' => 3000.00,
                'deskripsi' => 'Transfer melalui Bank Mandiri',
                'logo' => 'metode-pembayaran/mandiri-logo.svg',
                'is_aktif' => true,
            ],
            [
                'nama' => 'Bank BRI',
                'kode' => 'BRI',
                'atas_nama' => 'PT. Petir Pay Indonesia',
                'nomor_rekening' => '5555666677',
                'biaya_admin' => 2000.00,
                'deskripsi' => 'Transfer melalui Bank BRI',
                'logo' => 'metode-pembayaran/bri-logo.svg',
                'is_aktif' => true,
            ],
            [
                'nama' => 'OVO',
                'kode' => 'OVO',
                'atas_nama' => 'PetirPay Official',
                'nomor_rekening' => '081234567890',
                'biaya_admin' => 1500.00,
                'deskripsi' => 'Pembayaran melalui OVO',
                'logo' => 'metode-pembayaran/ovo-logo.svg',
                'is_aktif' => true,
            ],
            [
                'nama' => 'GoPay',
                'kode' => 'GOPAY',
                'atas_nama' => 'PetirPay Official',
                'nomor_rekening' => '081987654321',
                'biaya_admin' => 1000.00,
                'deskripsi' => 'Pembayaran melalui GoPay',
                'logo' => 'metode-pembayaran/gopay-logo.svg',
                'is_aktif' => true,
            ],
            [
                'nama' => 'DANA',
                'kode' => 'DANA',
                'atas_nama' => 'PetirPay Official',
                'nomor_rekening' => '081555444333',
                'biaya_admin' => 1200.00,
                'deskripsi' => 'Pembayaran melalui DANA',
                'logo' => 'metode-pembayaran/dana-logo.svg',
                'is_aktif' => true,
            ],
        ];

        foreach ($metodePembayaran as $metode) {
            MetodePembayaran::create($metode);
        }
    }
}
