<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tarif;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TarifController extends Controller
{
    public function index()
    {
        $tarifs = Tarif::orderBy('created_at', 'desc')->get();

        return Inertia::render('admin/kelola-tarif', [
            'tarifs' => $tarifs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'daya' => 'required|integer|min:1',
            'tarif_per_kwh' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        Tarif::create([
            'daya' => $request->daya,
            'tarif_per_kwh' => $request->tarif_per_kwh,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'Tarif berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'daya' => 'required|integer|min:1',
            'tarif_per_kwh' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        $tarif = Tarif::findOrFail($id);
        $tarif->update([
            'daya' => $request->daya,
            'tarif_per_kwh' => $request->tarif_per_kwh,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->back()->with('success', 'Tarif berhasil diperbarui');
    }

    public function destroy($id)
    {
        $tarif = Tarif::findOrFail($id);
        $tarif->delete();

        return redirect()->back()->with('success', 'Tarif berhasil dihapus');
    }
}
