<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exports\PelangganExport;
use App\Models\Pelanggan;
use App\Models\Tarif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class PelangganController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 10);

        $query = Pelanggan::with('tarif')
            ->when($search, function ($query, $search) {
                return $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nomor_meter', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc');

        $pelanggan = $query->paginate($perPage);

        $tarifs = Tarif::all(['id', 'daya', 'tarif_per_kwh', 'deskripsi']);

        return Inertia::render('admin/data-pelanggan', [
            'title' => 'Data Pelanggan',
            'pelanggan' => $pelanggan,
            'tarifs' => $tarifs,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
            'stats' => [
                'total_pelanggan' => Pelanggan::count(),
                'total_tarif_900va' => Pelanggan::whereHas('tarif', function ($q) {
                    $q->where('daya', 900);
                })->count(),
                'total_tarif_1300va' => Pelanggan::whereHas('tarif', function ($q) {
                    $q->where('daya', 1300);
                })->count(),
                'total_tarif_2200va' => Pelanggan::whereHas('tarif', function ($q) {
                    $q->where('daya', 2200);
                })->count(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:pelanggan,email',
            'password' => 'required|string|min:8|confirmed',
            'nomor_meter' => 'required|string|max:20|unique:pelanggan,nomor_meter',
            'alamat' => 'required|string|max:500',
            'id_tarif' => 'required|exists:tarifs,id',
        ], [
            'nama.required' => 'Nama harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password harus diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'nomor_meter.required' => 'Nomor meter harus diisi.',
            'nomor_meter.unique' => 'Nomor meter sudah terdaftar.',
            'alamat.required' => 'Alamat harus diisi.',
            'id_tarif.required' => 'Tarif harus dipilih.',
            'id_tarif.exists' => 'Tarif tidak valid.',
        ]);

        $pelanggan = Pelanggan::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nomor_meter' => $request->nomor_meter,
            'alamat' => $request->alamat,
            'id_tarif' => $request->id_tarif,
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Pelanggan berhasil ditambahkan!');
    }

    public function show($id)
    {
        $pelanggan = Pelanggan::with([
            'tarif',
            'penggunaan' => function ($query) {
                $query->latest()->take(12); // 12 bulan terakhir
            },
            'tagihan' => function ($query) {
                $query->with([
                    'pelanggan.tarif',
                    'pembayaran.metodePembayaran'
                ])->latest()->take(12);
            }
        ])->findOrFail($id);

        return Inertia::render('admin/detail-pelanggan', [
            'title' => 'Detail Pelanggan',
            'pelanggan' => $pelanggan,
        ]);
    }

    public function update(Request $request, $id)
    {
        $pelanggan = Pelanggan::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('pelanggan', 'email')->ignore($pelanggan->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'nomor_meter' => ['required', 'string', 'max:20', Rule::unique('pelanggan', 'nomor_meter')->ignore($pelanggan->id)],
            'alamat' => 'required|string|max:500',
            'id_tarif' => 'required|exists:tarifs,id',
        ], [
            'nama.required' => 'Nama harus diisi.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'nomor_meter.required' => 'Nomor meter harus diisi.',
            'nomor_meter.unique' => 'Nomor meter sudah terdaftar.',
            'alamat.required' => 'Alamat harus diisi.',
            'id_tarif.required' => 'Tarif harus dipilih.',
            'id_tarif.exists' => 'Tarif tidak valid.',
        ]);

        $updateData = [
            'nama' => $request->nama,
            'email' => $request->email,
            'nomor_meter' => $request->nomor_meter,
            'alamat' => $request->alamat,
            'id_tarif' => $request->id_tarif,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $pelanggan->update($updateData);

        return back()->with('success', 'Data pelanggan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $pelanggan = Pelanggan::findOrFail($id);

        // Check if pelanggan has related data
        if ($pelanggan->penggunaan()->exists() || $pelanggan->tagihan()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus pelanggan yang memiliki data penggunaan atau tagihan!');
        }

        $pelanggan->delete();

        return back()->with('success', 'Pelanggan berhasil dihapus!');
    }

    public function exportSelected(Request $request)
    {
        $request->validate([
            'selected_ids' => 'required|array',
            'selected_ids.*' => 'exists:pelanggan,id',
        ]);

        $selectedIds = $request->selected_ids;
        $pelanggan = Pelanggan::with('tarif')->whereIn('id', $selectedIds)->get();

        $filename = 'data-pelanggan-' . date('Y-m-d') . '.xlsx';

        return Excel::download(new PelangganExport($pelanggan), $filename);
    }

    public function exportAll()
    {
        $pelanggan = Pelanggan::with('tarif')->get();

        $filename = 'semua-data-pelanggan-' . date('Y-m-d') . '.xlsx';

        return Excel::download(new PelangganExport($pelanggan), $filename);
    }
}
