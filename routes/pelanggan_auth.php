<?php

use App\Http\Controllers\Pelanggan\AuthController;
use App\Http\Controllers\Pelanggan\DashboardController;
use Illuminate\Support\Facades\Route;


// Alias
Route::get('/login', function () {
    return redirect()->route('pelanggan.login');
})->name('login');


Route::middleware('guest:pelanggan')->group(function () {
    Route::get('mulai-sekarang', [AuthController::class, 'show_form'])
        ->name('pelanggan.login');

    Route::post('login', [AuthController::class, 'login'])
        ->name('pelanggan.login.attempt');

    Route::post('register', [AuthController::class, 'register'])
        ->name('pelanggan.register');
});


Route::middleware('auth:pelanggan')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])
        ->name('pelanggan.logout');
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('pelanggan.dashboard');
    Route::post('upload-bukti-pembayaran', [DashboardController::class, 'uploadBuktiPembayaran'])
        ->name('pelanggan.upload-bukti-pembayaran');
});