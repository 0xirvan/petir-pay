<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Models\MetodePembayaran;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard page.
     */
    public function index()
    {
        if (!Auth::guard('pelanggan')->check()) {
            return redirect()->route('pelanggan.login');
        }

        $pelanggan = Auth::guard('pelanggan')->user();
        $pelanggan->load(['tarif']);

        // Tagihan terbaru yang belum dibayar
        $currentBill = Tagihan::where('id_pelanggan', $pelanggan->id)
            ->where('status', 'belum_bayar')
            ->with(['penggunaan', 'pelanggan.tarif'])
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->first();

        // Riwayat tagihan (semua tagihan untuk ditampilkan di riwayat)
        $riwayatTagihan = Tagihan::where('id_pelanggan', $pelanggan->id)
            ->with(['penggunaan', 'pembayaran.metodePembayaran', 'pelanggan.tarif'])
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($tagihan) {
                $pembayaran = $tagihan->pembayaran->first();
                return [
                    'id' => $tagihan->id,
                    'periode' => $this->formatPeriode($tagihan->bulan, $tagihan->tahun),
                    'pemakaian' => $tagihan->jumlah_meter,
                    'tarif_per_kwh' => $tagihan->tarif_per_kwh,
                    'total' => $tagihan->total_biaya,
                    'status' => $tagihan->status,
                    'tanggal_bayar' => $pembayaran ? $pembayaran->tanggal_pembayaran : null,
                    'metode_pembayaran' => $pembayaran ? $pembayaran->metodePembayaran->nama : null,
                ];
            });

        // Riwayat pembayaran
        $riwayatPembayaran = Pembayaran::where('id_pelanggan', $pelanggan->id)
            ->with(['tagihan', 'metodePembayaran'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($pembayaran) {
                return [
                    'id' => $pembayaran->id,
                    'tanggal' => $pembayaran->tanggal_pembayaran,
                    'periode' => $this->formatPeriode($pembayaran->bulan_bayar, $pembayaran->tagihan->tahun ?? date('Y')),
                    'jumlah' => $pembayaran->total_bayar,
                    'metode' => $pembayaran->metodePembayaran->nama,
                    'status' => $this->mapStatusPembayaran($pembayaran->status_verifikasi),
                    'no_referensi' => 'REF' . str_pad($pembayaran->id, 10, '0', STR_PAD_LEFT),
                ];
            });

        // Metode pembayaran aktif
        $metodePembayaran = MetodePembayaran::aktif()->get();

        // Format current bill
        $formattedCurrentBill = null;
        if ($currentBill) {
            $formattedCurrentBill = [
                'id' => $currentBill->id,
                'periode' => $this->formatPeriode($currentBill->bulan, $currentBill->tahun),
                'pemakaian' => $currentBill->jumlah_meter,
                'tarif_per_kwh' => $currentBill->tarif_per_kwh,
                'total' => $currentBill->total_biaya,
                'status' => $currentBill->status,
            ];
        }

        // Status dashboard (untuk menampilkan informasi lunas)
        $statusDashboard = 'belum_bayar';
        $tagihanTerbaru = Tagihan::where('id_pelanggan', $pelanggan->id)
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->first();

        if ($tagihanTerbaru && $tagihanTerbaru->status === 'lunas') {
            $statusDashboard = 'lunas';
        }

        return Inertia::render('pelanggan/dashboard', [
            'pelanggan' => [
                'nama' => $pelanggan->nama,
                'id_pelanggan' => $pelanggan->nomor_meter,
                'alamat' => $pelanggan->alamat,
                'daya' => $pelanggan->tarif->daya ?? '0 VA',
                'tarif' => $pelanggan->tarif->deskripsi ?? 'R1/TR',
            ],
            'currentBill' => $formattedCurrentBill,
            'riwayatTagihan' => $riwayatTagihan,
            'riwayatPembayaran' => $riwayatPembayaran,
            'metodePembayaran' => $metodePembayaran,
            'statusDashboard' => $statusDashboard,
        ]);
    }

    /**
     * Upload bukti pembayaran
     */
    public function uploadBuktiPembayaran(Request $request)
    {
        $request->validate([
            'tagihan_id' => 'required|exists:tagihan,id',
            'bukti_transfer' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB
        ]);

        $pelanggan = Auth::guard('pelanggan')->user();

        // Cek apakah tagihan milik pelanggan
        $tagihan = Tagihan::where('id', $request->tagihan_id)
            ->where('id_pelanggan', $pelanggan->id)
            ->where('status', 'belum_bayar')
            ->first();

        if (!$tagihan) {
            return back()->with('error', 'Tagihan tidak ditemukan atau sudah dibayar');
        }

        // Upload file
        $filename = Pembayaran::uploadBuktiTransfer($request->file('bukti_transfer'));

        // Simpan pembayaran
        $pembayaran = Pembayaran::create([
            'id_tagihan' => $tagihan->id,
            'id_pelanggan' => $pelanggan->id,
            'id_metode_pembayaran' => 1, // Transfer manual
            'tanggal_pembayaran' => now(),
            'bulan_bayar' => $tagihan->bulan,
            'total_bayar' => $tagihan->total_biaya,
            'bukti_transfer' => $filename,
            'status_verifikasi' => 'menunggu',
        ]);

        // Update status tagihan menjadi menunggu_konfirmasi
        $tagihan->update([
            'status' => 'menunggu_konfirmasi'
        ]);

        return back()->with([
            'success' => 'Bukti pembayaran berhasil diupload! Pembayaran Anda sedang diverifikasi.',
            'redirect_to_history' => true
        ]);
    }

    /**
     * Format periode bulan tahun
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

        return ($namaBulan[$bulan] ?? 'Bulan') . ' ' . $tahun;
    }

    /**
     * Get tanggal jatuh tempo (tanggal 20 bulan berikutnya)
     */
    private function getJatuhTempo($bulan, $tahun)
    {
        $bulanJatuhTempo = $bulan + 1;
        $tahunJatuhTempo = $tahun;

        if ($bulanJatuhTempo > 12) {
            $bulanJatuhTempo = 1;
            $tahunJatuhTempo++;
        }

        return $tahunJatuhTempo . '-' . str_pad($bulanJatuhTempo, 2, '0', STR_PAD_LEFT) . '-20';
    }

    /**
     * Map status pembayaran
     */
    private function mapStatusPembayaran($status)
    {
        switch ($status) {
            case 'menunggu':
                return 'menunggu_verifikasi';
            case 'disetujui':
                return 'berhasil';
            case 'ditolak':
                return 'gagal';
            default:
                return 'pending';
        }
    }
}
