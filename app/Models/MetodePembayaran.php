<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodePembayaran extends Model
{
    protected $table = 'metode_pembayaran';

    protected $fillable = [
        'nama',
        'kode',
        'atas_nama',
        'nomor_rekening',
        'biaya_admin',
        'deskripsi',
        'is_aktif',
    ];

    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class);
    }

    // Scope untuk hanya yang aktif
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }
}
