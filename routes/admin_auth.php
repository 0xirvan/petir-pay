<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('admin', function () {
    if (auth()->check()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('admin.login');
});


Route::get('admin/login', function () {
    if (auth()->check()) {
        return redirect()->route('admin.dashboard');
    }
    return app()->make(AuthController::class)->show_form(request());
})->name('admin.login');



Route::middleware('guest')->prefix('admin')->group(function () {
    Route::post('login', [AuthController::class, 'login'])
        ->name('admin.login.attempt');
});

