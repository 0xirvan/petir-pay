<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifikasiPembayaranController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status', 'menunggu');
        $perPage = $request->get('per_page', 10);

        $query = Pembayaran::with([
            'tagihan.pelanggan.tarif',
            'metodePembayaran',
            'verifikator'
        ])
            ->when($search, function ($query, $search) {
                return $query->whereHas('tagihan.pelanggan', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nomor_meter', 'like', "%{$search}%");
                });
            })
            ->when($status !== 'all', function ($query) use ($status) {
                return $query->where('status_verifikasi', $status);
            })
            ->orderBy('created_at', 'desc');

        $pembayaran = $query->paginate($perPage);

        return Inertia::render('admin/verifikasi-pembayaran', [
            'title' => 'Verifikasi Pembayaran',
            'pembayaranList' => $pembayaran,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
            'stats' => [
                'total_menunggu' => Pembayaran::menungguVerifikasi()->count(),
                'total_disetujui' => Pembayaran::disetujui()->count(),
                'total_ditolak' => Pembayaran::ditolak()->count(),
            ]
        ]);
    }

    public function approve(Request $request, $id)
    {
        $pembayaran = Pembayaran::with('tagihan')->findOrFail($id);

        $request->validate([
            'catatan_verifikasi' => 'nullable|string|max:500',
        ]);

        $pembayaran->update([
            'status_verifikasi' => 'disetujui',
            'catatan_verifikasi' => $request->catatan_verifikasi,
            'tanggal_verifikasi' => now(),
            'id_verifikator' => auth()->id(),
        ]);


        $pembayaran->tagihan->update([
            'status' => 'lunas',
            'tanggal_bayar' => $pembayaran->tanggal_pembayaran,
        ]);

        return back()->with('success', 'Pembayaran berhasil disetujui!');
    }

    public function reject(Request $request, $id)
    {
        $pembayaran = Pembayaran::with('tagihan')->findOrFail($id);

        $request->validate([
            'catatan_verifikasi' => 'required|string|max:500',
        ]);

        $pembayaran->update([
            'status_verifikasi' => 'ditolak',
            'catatan_verifikasi' => $request->catatan_verifikasi,
            'tanggal_verifikasi' => now(),
            'id_verifikator' => auth()->id(),
        ]);

        // Update status tagihan kembali ke belum_bayar
        $pembayaran->tagihan->update([
            'status' => 'belum_bayar',
            'tanggal_bayar' => null,
        ]);

        return back()->with('success', 'Pembayaran berhasil ditolak!');
    }

    public function show($id)
    {
        $pembayaran = Pembayaran::with([
            'tagihan.pelanggan.tarif',
            'metodePembayaran',
            'verifikator'
        ])->findOrFail($id);


        return Inertia::render('admin/detail-verifikasi-pembayaran', [
            'title' => 'Detail Verifikasi Pembayaran',
            'pembayaran' => $pembayaran,
        ]);
    }
}
