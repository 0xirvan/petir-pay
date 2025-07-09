<?php

use App\Http\Controllers\LandingPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingPageController::class, 'index'])->name('home');



require __DIR__ . '/auth.php';
