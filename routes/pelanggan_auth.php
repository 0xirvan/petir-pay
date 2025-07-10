<?php


use App\Http\Controllers\Pelanggan\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:pelanggan')->group(function () {
    Route::get('mulai-sekarang', [AuthController::class, 'show_form'])
        ->name('login');

    Route::post('login', [AuthController::class, 'store']);
});

Route::middleware('auth:pelanggan')->group(function () {
    Route::post('logout', [AuthController::class, 'destroy'])
        ->name('logout');
});
