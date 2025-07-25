<?php

/**
 * Modul: Tagihan
 * File: app/Models/Tagihan.php
 * Deskripsi: Model Eloquent untuk tabel tagihan, mengelola data tagihan pelanggan listrik dan relasinya.
 * Fungsi Utama:
 *   - penggunaan(): relasi ke Penggunaan (data pemakaian listrik)
 *   - pelanggan(): relasi ke Pelanggan (data pelanggan)
 *   - pembayaran(): relasi ke Pembayaran (data pembayaran tagihan)
 *   - scopeLunas(): filter tagihan dengan status lunas
 *   - scopeBelumBayar(): filter tagihan dengan status belum bayar
 *   - scopePeriode($bulan, $tahun): filter tagihan berdasarkan bulan dan tahun
 *   - getJumlahKwhAttribute(): accessor jumlah kWh (dari jumlah_meter)
 *   - getTarifPerKwhAttribute(): accessor tarif per kWh dari relasi tarif pelanggan
 *   - getTotalBiayaAttribute(): accessor total biaya tagihan
 * Properti:
 *   - $fillable: daftar kolom yang dapat diisi massal
 *   - $casts: konversi otomatis tanggal_bayar ke tipe datetime
 *   - $appends: atribut tambahan (jumlah_kwh, tarif_per_kwh, total_biaya)
 * Perubahan Terakhir:
 *   - Penambahan kolom tanggal_bayar pada $fillable dan $casts (mendukung pencatatan tanggal pembayaran)
 *   - Penyesuaian dokumentasi agar sesuai kode terbaru dan standar teknis aplikasi
 */

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
