<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
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

        return Inertia::render('pelanggan/dashboard', [
            'pelanggan' => $pelanggan
        ]);
    }
}
