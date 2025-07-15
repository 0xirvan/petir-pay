<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tagihan extends Model
{
    protected $table = 'tagihan';

    protected $fillable = [
        'id_penggunaan',
        'id_pelanggan',
        'bulan',
        'tahun',
        'jumlah_meter',
        'status',
        'tanggal_bayar',
    ];

    protected $casts = [
        'tanggal_bayar' => 'datetime',
    ];

    protected $appends = [
        'jumlah_kwh',
        'tarif_per_kwh',
        'total_biaya',
    ];

    /**
     * Relasi ke model Penggunaan
     */
    public function penggunaan()
    {
        return $this->belongsTo(Penggunaan::class, 'id_penggunaan');
    }

    /**
     * Relasi ke model Pelanggan
     */
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan');
    }

    /**
     * Relasi ke model Pembayaran
     */
    public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class, 'id_tagihan');
    }

    /**
     * Scope untuk status lunas
     */
    public function scopeLunas($query)
    {
        return $query->where('status', 'lunas');
    }

    /**
     * Scope untuk status belum_bayar
     */
    public function scopeBelumBayar($query)
    {
        return $query->where('status', 'belum_bayar');
    }

    /**
     * Scope untuk tagihan tahun dan bulan tertentu
     */
    public function scopePeriode($query, $bulan, $tahun)
    {
        return $query->where('bulan', $bulan)->where('tahun', $tahun);
    }

    /**
     * Accessor untuk jumlah kWh (alias untuk jumlah_meter)
     */
    public function getJumlahKwhAttribute(): int
    {
        return $this->jumlah_meter;
    }

    /**
     * Accessor untuk tarif per kWh
     */
    public function getTarifPerKwhAttribute(): float
    {
        if (!$this->pelanggan || !$this->pelanggan->tarif) {
            $this->load('pelanggan.tarif');
        }
        return $this->pelanggan->tarif->tarif_per_kwh ?? 0;
    }

    /**
     * Accessor untuk total biaya
     */
    public function getTotalBiayaAttribute(): float
    {
        return $this->jumlah_meter * $this->tarif_per_kwh;
    }
}
