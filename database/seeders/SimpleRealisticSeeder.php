<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Tarif;
use App\Models\Pelanggan;
use App\Models\Penggunaan;
use App\Models\Tagihan;
use App\Models\MetodePembayaran;
use App\Models\Pembayaran;

class SimpleRealisticSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        echo "🚀 Memulai SimpleRealisticSeeder...\n";

        // 1. Buat 1 tarif realistik (atau gunakan yang sudah ada)
        echo "📊 Membuat tarif...\n";
        $tarif = Tarif::firstOrCreate([
            'daya' => 900,
            'tarif_per_kwh' => 1467.28,
            'deskripsi' => 'Tarif Rumah Tangga 900 VA (R1/TR)'
        ]);
        echo "✅ Tarif berhasil dibuat/ditemukan: ID {$tarif->id}\n";

        // 2. Gunakan admin yang sudah ada atau buat admin baru
        echo "👤 Mencari admin...\n";
        $admin = User::where('role', 'administrator')->first();
        if (!$admin) {
            echo "👤 Membuat admin baru...\n";
            $admin = User::create([
                'name' => 'Ahmad Rizki',
                'email' => 'admin.simple@petirpay.com',
                'password' => Hash::make('password123'),
                'role' => 'administrator'
            ]);
        }
        echo "✅ Admin berhasil ditemukan/dibuat: {$admin->name}\n";

        // 3. Buat 1 pelanggan baru dengan email unik
        echo "🏠 Membuat pelanggan...\n";
        $timestamp = now()->timestamp;
        $pelanggan = Pelanggan::create([
            'nama' => 'Budi Santoso',
            'email' => "budi.santoso.{$timestamp}@gmail.com",
            'password' => Hash::make('pelanggan123'),
            'nomor_meter' => 'PLN' . str_pad(rand(100000, 999999), 9, '0', STR_PAD_LEFT),
            'alamat' => 'Jl. Merdeka No. 45, RT 03/RW 05, Kelurahan Sumber, Kecamatan Banjaran, Bandung 40377',
            'id_tarif' => $tarif->id
        ]);
        echo "✅ Pelanggan berhasil dibuat: {$pelanggan->nama} ({$pelanggan->nomor_meter})\n";

        // 4. Buat 1 penggunaan listrik untuk bulan lalu
        echo "⚡ Membuat data penggunaan...\n";
        $bulanLalu = Carbon::now()->subMonth();
        $meterAwal = 1250;
        $meterAkhir = 1395; // Penggunaan 145 kWh (realistik untuk rumah tangga)

        $penggunaan = Penggunaan::create([
            'id_pelanggan' => $pelanggan->id,
            'bulan' => $bulanLalu->month,
            'tahun' => $bulanLalu->year,
            'meter_awal' => $meterAwal,
            'meter_akhir' => $meterAkhir
        ]);
        $jumlahKwh = $meterAkhir - $meterAwal;
        echo "✅ Penggunaan berhasil dibuat: {$jumlahKwh} kWh untuk {$bulanLalu->format('F Y')}\n";

        // 5. Buat 1 tagihan berdasarkan penggunaan
        echo "📄 Membuat tagihan...\n";
        $tagihan = Tagihan::create([
            'id_penggunaan' => $penggunaan->id,
            'id_pelanggan' => $pelanggan->id,
            'bulan' => $bulanLalu->month,
            'tahun' => $bulanLalu->year,
            'jumlah_meter' => $jumlahKwh,
            'status' => 'lunas',
            'tanggal_bayar' => Carbon::now()->subDays(3)
        ]);
        $totalBiaya = $jumlahKwh * $tarif->tarif_per_kwh;
        echo "✅ Tagihan berhasil dibuat: Rp " . number_format($totalBiaya, 0, ',', '.') . "\n";

        // 6. Buat 1 metode pembayaran (atau gunakan yang sudah ada)
        echo "💳 Membuat metode pembayaran...\n";
        $metodePembayaran = MetodePembayaran::firstOrCreate([
            'kode' => 'BRI_TRANSFER',
        ], [
            'nama' => 'Transfer Bank BRI',
            'atas_nama' => 'PT PLN (Persero)',
            'nomor_rekening' => '0123-01-004567-30-9',
            'biaya_admin' => 2500,
            'deskripsi' => 'Transfer melalui Bank BRI dengan biaya admin Rp 2.500',
            'is_aktif' => true
        ]);
        echo "✅ Metode pembayaran berhasil dibuat/ditemukan: {$metodePembayaran->nama}\n";

        // 7. Buat 1 pembayaran
        echo "💰 Membuat pembayaran...\n";
        $totalBayar = $totalBiaya + $metodePembayaran->biaya_admin;

        $pembayaran = Pembayaran::create([
            'id_tagihan' => $tagihan->id,
            'id_pelanggan' => $pelanggan->id,
            'id_metode_pembayaran' => $metodePembayaran->id,
            'tanggal_pembayaran' => Carbon::now()->subDays(3),
            'bulan_bayar' => $bulanLalu->month,
            'total_bayar' => $totalBayar,
            'status_verifikasi' => 'disetujui',
            'id_verifikator' => $admin->id,
            'tanggal_verifikasi' => Carbon::now()->subDays(2),
        ]);
        echo "✅ Pembayaran berhasil dibuat: Rp " . number_format($totalBayar, 0, ',', '.') . "\n";

        echo "\n🎉 Seeder SimpleRealisticSeeder berhasil dijalankan!\n";
        echo "📋 Ringkasan data yang dibuat:\n";
        echo "   🏢 Tarif: {$tarif->daya} VA - Rp " . number_format($tarif->tarif_per_kwh, 0, ',', '.') . "/kWh\n";
        echo "   👤 Admin: {$admin->name} ({$admin->email})\n";
        echo "   🏠 Pelanggan: {$pelanggan->nama} - {$pelanggan->nomor_meter}\n";
        echo "   ⚡ Penggunaan: {$jumlahKwh} kWh ({$bulanLalu->format('F Y')})\n";
        echo "   📄 Tagihan: Rp " . number_format($totalBiaya, 0, ',', '.') . " (Status: {$tagihan->status})\n";
        echo "   💳 Metode: {$metodePembayaran->nama}\n";
        echo "   💰 Pembayaran: Rp " . number_format((float)$totalBayar, 0, ',', '.') . " (Admin: Rp " . number_format((float)$metodePembayaran->biaya_admin, 0, ',', '.') . ")\n";
    }
}
