<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        return Inertia::render('guest/home');
    }

    public function cek_tarif()
    {
        return Inertia::render('guest/cek-tarif');
    }
}
