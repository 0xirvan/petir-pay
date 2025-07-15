<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ManageAdminController;
use App\Http\Controllers\Admin\TarifController;
use Illuminate\Support\Facades\Route;




Route::middleware('auth')->prefix('admin')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])
        ->name('admin.logout');
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');


    Route::middleware('admin')->group(function () {
        Route::get('kelola-admin', [ManageAdminController::class, 'index'])
            ->name('admin.kelola-admin');
        Route::post('kelola-admin', [ManageAdminController::class, 'store'])
            ->name('admin.kelola-admin.store');
        Route::put('kelola-admin/{id}', [ManageAdminController::class, 'update'])
            ->name('admin.kelola-admin.update');
        Route::delete('kelola-admin/{id}', [ManageAdminController::class, 'destroy'])
            ->name('admin.kelola-admin.destroy');

        Route::get('kelola-tarif', [TarifController::class, 'index'])
            ->name('admin.kelola-tarif');
        Route::post('kelola-tarif', [TarifController::class, 'store'])
            ->name('admin.kelola-tarif.store');
        Route::put('kelola-tarif/{id}', [TarifController::class, 'update'])
            ->name('admin.kelola-tarif.update');
        Route::delete('kelola-tarif/{id}', [TarifController::class, 'destroy'])
            ->name('admin.kelola-tarif.destroy');
    });
});