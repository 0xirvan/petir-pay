<?php

namespace Database\Seeders;

use App\Models\MetodePembayaran;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Database\Seeder;

class PembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all paid tagihan to create payments for
        $paidTagihan = Tagihan::where('status', 'lunas')
            ->with(['pelanggan', 'penggunaan'])
            ->get();

        $metodePembayaran = MetodePembayaran::all();
        $users = User::where('role', 'administrator')->get();

        if ($metodePembayaran->isEmpty()) {
            // If no payment methods exist, create some basic ones
            $metodePembayaran = collect([
                MetodePembayaran::create([
                    'nama' => 'Transfer Bank',
                    'deskripsi' => 'Pembayaran melalui transfer bank',
                    'biaya_admin' => 2500,
                    'status' => 'aktif',
                ]),
                MetodePembayaran::create([
                    'nama' => 'E-Wallet',
                    'deskripsi' => 'Pembayaran melalui e-wallet (OVO, GoPay, Dana)',
                    'biaya_admin' => 1500,
                    'status' => 'aktif',
                ]),
                MetodePembayaran::create([
                    'nama' => 'Virtual Account',
                    'deskripsi' => 'Pembayaran melalui virtual account',
                    'biaya_admin' => 2000,
                    'status' => 'aktif',
                ]),
            ]);
        }

        foreach ($paidTagihan as $tagihan) {
            $metode = $metodePembayaran->random();
            $user = $users->random();
            $biayaAdmin = $metode->biaya_admin ?? 2500;
            $totalBayar = $tagihan->jumlah_meter + $biayaAdmin;

            Pembayaran::create([
                'id_tagihan' => $tagihan->id,
                'id_pelanggan' => $tagihan->id_pelanggan,
                'id_metode_pembayaran' => $metode->id,
                'tanggal_pembayaran' => $this->getRandomPaymentDate($tagihan),
                'bulan_bayar' => $tagihan->bulan,
                'total_bayar' => $totalBayar,
                'id_user' => $user->id,
                'created_at' => $tagihan->updated_at,
                'updated_at' => $tagihan->updated_at,
            ]);
        }

        // Create some payments for confirmed tagihan
        $confirmedTagihan = Tagihan::where('status', 'menunggu_konfirmasi')
            ->limit(5)
            ->with(['pelanggan', 'penggunaan'])
            ->get();

        foreach ($confirmedTagihan as $tagihan) {
            $metode = $metodePembayaran->random();
            $user = $users->random();
            $biayaAdmin = $metode->biaya_admin ?? 2500;
            $totalBayar = $tagihan->jumlah_meter + $biayaAdmin;

            Pembayaran::create([
                'id_tagihan' => $tagihan->id,
                'id_pelanggan' => $tagihan->id_pelanggan,
                'id_metode_pembayaran' => $metode->id,
                'tanggal_pembayaran' => now(),
                'bulan_bayar' => $tagihan->bulan,
                'total_bayar' => $totalBayar,
                'id_user' => $user->id,
                'created_at' => now()->subDays(rand(1, 3)),
                'updated_at' => now()->subDays(rand(1, 3)),
            ]);
        }
    }

    private function getRandomPaymentDate($tagihan): \Carbon\Carbon
    {
        // Payment date should be after the tagihan creation
        $start = $tagihan->created_at;
        $end = now();

        $randomDays = rand(1, max(1, $start->diffInDays($end)));
        return $start->addDays($randomDays);
    }
}
