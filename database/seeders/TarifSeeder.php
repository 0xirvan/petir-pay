<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TarifSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Tarif::create([
            'daya' => 450,
            'tarif_per_kwh' => 415.00,
            'deskripsi' => 'Tarif untuk pelanggan dengan daya 450 VA.',
        ]);

        \App\Models\Tarif::create([
            'daya' => 900,
            'tarif_per_kwh' => 605.00,
            'deskripsi' => 'Tarif untuk pelanggan dengan daya 900 VA.',
        ]);

        \App\Models\Tarif::create([
            'daya' => 1300,
            'tarif_per_kwh' => 1_467.28,
            'deskripsi' => 'Tarif untuk pelanggan dengan daya 1300 VA.',
        ]);

        \App\Models\Tarif::create([
            'daya' => 2200,
            'tarif_per_kwh' => 1_467.28,
            'deskripsi' => 'Tarif untuk pelanggan dengan daya 2200 VA.',
        ]);
    }
}
