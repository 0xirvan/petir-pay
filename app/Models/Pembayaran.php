<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $table = 'pembayaran';

    protected $fillable = [
        'id_tagihan',
        'id_pelanggan',
        'id_metode_pembayaran',
        'tanggal_pembayaran',
        'bulan_bayar',
        'total_bayar',
        'id_user',
    ];

    /**
     * Relasi ke model Tagihan
     */
    public function tagihan()
    {
        return $this->belongsTo(Tagihan::class, 'id_tagihan');
    }

    /**
     * Relasi ke model Pelanggan
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan');
    }

    /**
     * Relasi ke model MetodePembayaran
     */
    public function metodePembayaran()
    {
        return $this->belongsTo(MetodePembayaran::class, 'id_metode_pembayaran');
    }

    /**
     * Relasi ke model User (yang memproses pembayaran)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
