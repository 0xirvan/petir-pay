<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ManageAdminController;
use App\Http\Controllers\Admin\MetodePembayaranController;
use App\Http\Controllers\Admin\PelangganController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\TagihanController;
use App\Http\Controllers\Admin\TarifController;
use App\Http\Controllers\Admin\VerifikasiPembayaranController;
use Illuminate\Support\Facades\Route;




Route::middleware('auth')->prefix('admin')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])
        ->name('admin.logout');
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Routes hanya untuk Administrator
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

        Route::get('kelola-metode-pembayaran', [MetodePembayaranController::class, 'index'])
            ->name('admin.kelola-metode-pembayaran');
        Route::post('kelola-metode-pembayaran', [MetodePembayaranController::class, 'store'])
            ->name('admin.kelola-metode-pembayaran.store');
        Route::put('kelola-metode-pembayaran/{id}', [MetodePembayaranController::class, 'update'])
            ->name('admin.kelola-metode-pembayaran.update');
        Route::delete('kelola-metode-pembayaran/{id}', [MetodePembayaranController::class, 'destroy'])
            ->name('admin.kelola-metode-pembayaran.destroy');
        Route::patch('kelola-metode-pembayaran/{id}/toggle-status', [MetodePembayaranController::class, 'toggleStatus'])
            ->name('admin.kelola-metode-pembayaran.toggle-status');
    });

    // Routes untuk Administrator dan Petugas
    Route::middleware('admin.petugas')->group(function () {
        Route::get('data-pelanggan', [PelangganController::class, 'index'])
            ->name('admin.data-pelanggan');
        Route::post('data-pelanggan', [PelangganController::class, 'store'])
            ->name('admin.data-pelanggan.store');
        Route::get('data-pelanggan/{id}', [PelangganController::class, 'show'])
            ->name('admin.data-pelanggan.show');
        Route::put('data-pelanggan/{id}', [PelangganController::class, 'update'])
            ->name('admin.data-pelanggan.update');
        Route::delete('data-pelanggan/{id}', [PelangganController::class, 'destroy'])
            ->name('admin.data-pelanggan.destroy');
        Route::post('data-pelanggan/export-selected', [PelangganController::class, 'exportSelected'])
            ->name('admin.data-pelanggan.export-selected');
        Route::get('data-pelanggan/export/all', [PelangganController::class, 'exportAll'])
            ->name('admin.data-pelanggan.export-all');

        // Routes untuk Tagihan
        Route::get('tagihan', [TagihanController::class, 'index'])
            ->name('admin.tagihan');
        Route::post('tagihan', [TagihanController::class, 'store'])
            ->name('admin.tagihan.store');
        Route::put('tagihan/{id}', [TagihanController::class, 'update'])
            ->name('admin.tagihan.update');
        Route::delete('tagihan/{id}', [TagihanController::class, 'destroy'])
            ->name('admin.tagihan.destroy');
        Route::get('tagihan/search-pelanggan', [TagihanController::class, 'searchPelanggan'])
            ->name('admin.tagihan.search-pelanggan');
        Route::get('tagihan/penggunaan-bulan-sebelumnya', [TagihanController::class, 'getPenggunaanBulanSebelumnya'])
            ->name('admin.tagihan.penggunaan-bulan-sebelumnya');

        // Routes untuk Verifikasi Pembayaran
        Route::get('verifikasi-pembayaran', [VerifikasiPembayaranController::class, 'index'])
            ->name('admin.verifikasi-pembayaran');
        Route::get('verifikasi-pembayaran/{id}', [VerifikasiPembayaranController::class, 'show'])
            ->name('admin.verifikasi-pembayaran.show');
        Route::post('verifikasi-pembayaran/{id}/approve', [VerifikasiPembayaranController::class, 'approve'])
            ->name('admin.verifikasi-pembayaran.approve');
        Route::post('verifikasi-pembayaran/{id}/reject', [VerifikasiPembayaranController::class, 'reject'])
            ->name('admin.verifikasi-pembayaran.reject');

        // Routes untuk Pengaturan
        Route::get('pengaturan', [PengaturanController::class, 'index'])
            ->name('admin.pengaturan');
        Route::post('pengaturan/update-profile', [PengaturanController::class, 'updateProfile'])
            ->name('admin.pengaturan.update-profile');
        Route::post('pengaturan/update-password', [PengaturanController::class, 'updatePassword'])
            ->name('admin.pengaturan.update-password');
        Route::post('pengaturan/update-photo', [PengaturanController::class, 'updatePhoto'])
            ->name('admin.pengaturan.update-photo');
        Route::delete('pengaturan/delete-photo', [PengaturanController::class, 'deletePhoto'])
            ->name('admin.pengaturan.delete-photo');
    });
});