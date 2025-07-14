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
        $tarifs = Tarif::orderBy("daya")->get();

        return Inertia::render('admin/kelola-tarif', [
            'title' => 'Kelola Tarif',
            'tarifList' => $tarifs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'daya' => 'required|integer|min:1',
            'tarif_per_kwh' => 'required|numeric|min:0',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        $tarif = Tarif::create([
            'daya' => $request->input('daya'),
            'tarif_per_kwh' => $request->input('tarif_per_kwh'),
            'deskripsi' => $request->input('deskripsi'),
        ]);

        return back()->with([
            'success' => 'Tarif berhasil ditambahkan!',
            'tarifBaru' => $tarif,
        ]);
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

        return back()->with('success', 'Tarif berhasil diperbarui');
    }

    public function destroy($id)
    {
        $tarif = Tarif::findOrFail($id);
        $tarif->delete();

        return back()->with('success', 'Tarif berhasil dihapus');
    }
}
