<?php

namespace App\Http\Controllers;

use App\Models\Tarif;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        if (auth()->guard('pelanggan')->check()) {
            return redirect()->route('pelanggan.dashboard');
        }
        return Inertia::render('guest/home');
    }

    public function cek_tarif()
    {

        return Inertia::render('guest/cek-tarif', [
            'tarifList' => Tarif::all(),
        ]);
    }
}
