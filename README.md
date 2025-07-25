# Petir Pay

Aplikasi manajemen tagihan dan pembayaran listrik berbasis web.

## Fitur Utama

- Manajemen data pelanggan, tarif, penggunaan listrik, tagihan, dan pembayaran
- Proses pembuatan tagihan otomatis berdasarkan penggunaan
- Pembayaran tagihan oleh pelanggan
- Verifikasi pembayaran oleh admin/petugas
- Dashboard statistik dan laporan
- Hak akses terpisah untuk admin, petugas, dan pelanggan

## Struktur Direktori Penting

- `app/Models/` : Model Eloquent (Tagihan, Pelanggan, Penggunaan, Pembayaran, Tarif, dsb)
- `app/Http/Controllers/` : Controller untuk admin, petugas, dan pelanggan
- `database/migrations/` : Migrasi struktur database
- `resources/js/` : Komponen frontend (React/JS/TS)
- `routes/` : Definisi route aplikasi

## Cara Instalasi

1. Clone repository ini
2. Jalankan `composer install` untuk menginstal dependensi PHP
3. Jalankan `npm install` untuk menginstal dependensi frontend
4. Copy `.env.example` ke `.env` dan sesuaikan konfigurasi database
5. Jalankan migrasi database: `php artisan migrate --seed`
6. Jalankan server lokal: `composer run dev`
