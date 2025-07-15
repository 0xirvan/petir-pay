<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MetodePembayaran;
use App\Models\Pelanggan;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $statistik = [
            'total_pelanggan' => Pelanggan::count(),
            'total_admin' => User::count(),
            'total_tagihan_belum_bayar' => Tagihan::where('status', 'belum_bayar')->count(),
            'total_tagihan_menunggu_konfirmasi' => Tagihan::where('status', 'menunggu_konfirmasi')->count(),
            'total_tagihan_lunas' => Tagihan::where('status', 'lunas')->count(),
            // Perbaikan: Gunakan pembayaran untuk perhitungan yang akurat
            'total_pendapatan_bulan_ini' => Pembayaran::whereMonth('tanggal_pembayaran', now()->month)
                ->whereYear('tanggal_pembayaran', now()->year)
                ->sum('total_bayar') ?? 0,
            'total_pendapatan_hari_ini' => Pembayaran::whereDate('tanggal_pembayaran', now()->toDateString())
                ->sum('total_bayar') ?? 0,
            'total_pendapatan' => Pembayaran::sum('total_bayar') ?? 0,
        ];


        $recentTagihan = Tagihan::with(['pelanggan.tarif'])
            ->where('status', 'menunggu_konfirmasi')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($tagihan) {
                return [
                    'id' => $tagihan->id,
                    'nama_pelanggan' => $tagihan->pelanggan->nama,
                    'periode' => $this->formatPeriode($tagihan->bulan, $tagihan->tahun),
                    'total' => $this->calculateTotal($tagihan),
                    'status' => $tagihan->status,
                    'jumlah_meter' => $tagihan->jumlah_meter,
                ];
            });


        $recentPelanggan = Pelanggan::with('tarif')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($pelanggan) {
                return [
                    'id' => $pelanggan->id,
                    'nama' => $pelanggan->nama,
                    'daya' => $pelanggan->tarif ? $pelanggan->tarif->daya : 0,
                    'tanggal_daftar' => $pelanggan->created_at->format('Y-m-d'),
                    'status' => $pelanggan->status ?? 'aktif',
                ];
            });


        $pendapatanBulanan = $this->getMonthlyRevenue();

        return Inertia::render('admin/dashboard', [
            'title' => 'Dashboard Admin',
            'statistik' => $statistik,
            'recent_tagihan' => $recentTagihan,
            'recent_pelanggan' => $recentPelanggan,
            'pendapatan_bulanan' => $pendapatanBulanan,
        ]);
    }

    /**
     * Format periode bulan dan tahun
     */
    private function formatPeriode($bulan, $tahun)
    {
        $namaBulan = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        return $namaBulan[$bulan] . ' ' . $tahun;
    }

    /**
     * Calculate total tagihan berdasarkan tarif dari database
     */
    private function calculateTotal($tagihan, $metodePembayaranId = null)
    {
        // Ambil tarif per kWh dari relasi pelanggan -> tarif
        $tarifPerKwh = 0;
        if ($tagihan->pelanggan && $tagihan->pelanggan->tarif) {
            $tarifPerKwh = $tagihan->pelanggan->tarif->tarif_per_kwh;
        } else {
            // Fallback jika tidak ada tarif yang di-set
            $tarifPerKwh = 1500;
        }

        // Biaya admin berdasarkan metode pembayaran (jika ada)
        $biayaAdmin = 5000;

        if ($metodePembayaranId) {
            $metodePembayaran = MetodePembayaran::find($metodePembayaranId);
            if ($metodePembayaran) {
                $biayaAdmin = $metodePembayaran->biaya_admin ?? 5000;
            }
        } else {
            $metodeTermurah = MetodePembayaran::where('is_aktif', true)
                ->orderBy('biaya_admin', 'asc')
                ->first();

            if ($metodeTermurah) {
                $biayaAdmin = $metodeTermurah->biaya_admin;
            }
        }

        // Hitung total: (jumlah meter * tarif per kWh) + biaya admin
        $totalListrik = $tagihan->jumlah_meter * $tarifPerKwh;
        $totalTagihan = $totalListrik + $biayaAdmin;

        return (int) $totalTagihan;
    }

    /**
     * Get detailed breakdown of tagihan calculation
     */
    private function getTagihanBreakdown($tagihan, $metodePembayaranId = null)
    {
        // Ambil tarif per kWh
        $tarifPerKwh = 0;
        if ($tagihan->pelanggan && $tagihan->pelanggan->tarif) {
            $tarifPerKwh = $tagihan->pelanggan->tarif->tarif_per_kwh;
        } else {
            $tarifPerKwh = 1500; // Default
        }

        // Biaya admin
        $biayaAdmin = 5000; // Default
        if ($metodePembayaranId) {
            $metodePembayaran = MetodePembayaran::find($metodePembayaranId);
            if ($metodePembayaran) {
                $biayaAdmin = $metodePembayaran->biaya_admin ?? 5000;
            }
        } else {
            $metodeTermurah = MetodePembayaran::where('is_aktif', true)
                ->orderBy('biaya_admin', 'asc')
                ->first();
            if ($metodeTermurah) {
                $biayaAdmin = $metodeTermurah->biaya_admin;
            }
        }

        $totalListrik = $tagihan->jumlah_meter * $tarifPerKwh;
        $totalTagihan = $totalListrik + $biayaAdmin;

        return [
            'jumlah_meter' => $tagihan->jumlah_meter,
            'tarif_per_kwh' => $tarifPerKwh,
            'total_listrik' => $totalListrik,
            'biaya_admin' => $biayaAdmin,
            'total_tagihan' => $totalTagihan,
        ];
    }

    /**
     * Get monthly revenue data for the last 12 months
     */
    private function getMonthlyRevenue()
    {
        $months = [];
        $targetBulanan = 50_000_000;


        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);

            // Gunakan data pembayaran untuk perhitungan yang akurat
            $pendapatan = Pembayaran::whereMonth('tanggal_pembayaran', $date->month)
                ->whereYear('tanggal_pembayaran', $date->year)
                ->sum('total_bayar') ?? 0;

            // Jika tidak ada data pembayaran, fallback ke tagihan lunas
            if ($pendapatan == 0) {
                $pendapatan = Tagihan::join('pelanggan', 'tagihan.id_pelanggan', '=', 'pelanggan.id')
                    ->join('tarif', 'pelanggan.id_tarif', '=', 'tarif.id')
                    ->where('tagihan.status', 'lunas')
                    ->whereMonth('tagihan.tanggal_bayar', $date->month)
                    ->whereYear('tagihan.tanggal_bayar', $date->year)
                    ->selectRaw('SUM(tagihan.jumlah_meter * tarif.tarif_per_kwh + 2500) as total')
                    ->value('total') ?? 0;
            }

            $months[] = [
                'bulan' => $date->format('M Y'),
                'pendapatan' => (int) $pendapatan,
                'target' => $targetBulanan,
            ];
        }

        return $months;
    }
}
