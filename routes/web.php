<?php

use App\Http\Controllers\LandingPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingPageController::class, 'index'])->name('home');
Route::get('/cek-tarif', [LandingPageController::class, 'cek_tarif'])->name('cek-tarif');


require __DIR__ . '/admin_auth.php';
require __DIR__ . '/pelanggan_auth.php';
require __DIR__ . '/admin.php';
