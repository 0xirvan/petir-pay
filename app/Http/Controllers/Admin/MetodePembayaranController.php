<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MetodePembayaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetodePembayaranController extends Controller
{
    public function index()
    {
        $metodePembayaran = MetodePembayaran::orderBy('nama')->get();

        return Inertia::render('admin/kelola-metode-pembayaran', [
            'title' => 'Kelola Metode Pembayaran',
            'metodePembayaranList' => $metodePembayaran
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:50|unique:metode_pembayaran,kode',
            'atas_nama' => 'required|string|max:255',
            'nomor_rekening' => 'nullable|string|max:255',
            'biaya_admin' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_aktif' => 'boolean',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('metode-pembayaran', 'public');
        }

        $metodePembayaran = MetodePembayaran::create([
            'nama' => $request->input('nama'),
            'kode' => strtoupper($request->input('kode')),
            'atas_nama' => $request->input('atas_nama'),
            'nomor_rekening' => $request->input('nomor_rekening'),
            'biaya_admin' => $request->input('biaya_admin'),
            'deskripsi' => $request->input('deskripsi'),
            'logo' => $logoPath,
            'is_aktif' => $request->input('is_aktif', true),
        ]);

        return back()->with([
            'success' => 'Metode pembayaran berhasil ditambahkan!',
            'metodePembayaranBaru' => $metodePembayaran,
        ]);
    }

    public function update(Request $request, $id)
    {
        $metodePembayaran = MetodePembayaran::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:50|unique:metode_pembayaran,kode,' . $id,
            'atas_nama' => 'required|string|max:255',
            'nomor_rekening' => 'nullable|string|max:255',
            'biaya_admin' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_aktif' => 'boolean',
        ]);

        $logoPath = $metodePembayaran->logo;
        if ($request->hasFile('logo')) {
            // Hapus logo lama jika ada
            if ($logoPath) {
                \Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('metode-pembayaran', 'public');
        }

        $metodePembayaran->update([
            'nama' => $request->input('nama'),
            'kode' => strtoupper($request->input('kode')),
            'atas_nama' => $request->input('atas_nama'),
            'nomor_rekening' => $request->input('nomor_rekening'),
            'biaya_admin' => $request->input('biaya_admin'),
            'deskripsi' => $request->input('deskripsi'),
            'logo' => $logoPath,
            'is_aktif' => $request->input('is_aktif', true),
        ]);

        return back()->with([
            'success' => 'Metode pembayaran berhasil diupdate!',
            'metodePembayaranUpdate' => $metodePembayaran,
        ]);
    }

    public function destroy($id)
    {
        $metodePembayaran = MetodePembayaran::findOrFail($id);

        // Cek apakah metode pembayaran sedang digunakan
        if ($metodePembayaran->pembayaran()->exists()) {
            return back()->with([
                'error' => 'Metode pembayaran tidak dapat dihapus karena masih digunakan dalam transaksi!'
            ]);
        }

        // Hapus logo jika ada
        if ($metodePembayaran->logo) {
            \Storage::disk('public')->delete($metodePembayaran->logo);
        }

        $metodePembayaran->delete();

        return back()->with([
            'success' => 'Metode pembayaran berhasil dihapus!'
        ]);
    }

    public function toggleStatus($id)
    {
        $metodePembayaran = MetodePembayaran::findOrFail($id);
        $metodePembayaran->update([
            'is_aktif' => !$metodePembayaran->is_aktif
        ]);

        $status = $metodePembayaran->is_aktif ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with([
            'success' => "Metode pembayaran berhasil {$status}!"
        ]);
    }
}
