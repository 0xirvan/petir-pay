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
        'logo',
        'is_aktif',
    ];

    protected $appends = ['logo_url'];

    protected $casts = [
        'is_aktif' => 'boolean',
        'biaya_admin' => 'decimal:2',
    ];

    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class, 'id_metode_pembayaran');
    }

    // Scope untuk hanya yang aktif
    public function scopeAktif($query)
    {
        return $query->where('is_aktif', true);
    }

    // Accessor untuk URL logo
    public function getLogoUrlAttribute()
    {
        if (!$this->logo) {
            return null;
        }

        if (str_starts_with($this->logo, 'metode-pembayaran/')) {
            return asset('storage/' . $this->logo);
        }

        // Default
        return asset('storage/' . $this->logo);
    }
}
