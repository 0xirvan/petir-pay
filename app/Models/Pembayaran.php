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
        'bukti_transfer',
        'status_verifikasi',
        'catatan_verifikasi',
        'tanggal_verifikasi',
        'id_verifikator',
    ];

    protected $casts = [
        'tanggal_pembayaran' => 'date',
        'tanggal_verifikasi' => 'datetime',
        'total_bayar' => 'decimal:2',
    ];

    protected $appends = ['bukti_transfer_url'];

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
     * Relasi ke model User (verifikator)
     */
    public function verifikator()
    {
        return $this->belongsTo(User::class, 'id_verifikator');
    }

    /**
     * Accessor untuk URL bukti transfer
     */
    public function getBuktiTransferUrlAttribute()
    {
        if (!$this->bukti_transfer) {
            return null;
        }

        return asset('storage/bukti-transfer/' . $this->bukti_transfer);
    }

    /**
     * Scope untuk status verifikasi menunggu
     */
    public function scopeMenungguVerifikasi($query)
    {
        return $query->where('status_verifikasi', 'menunggu');
    }

    /**
     * Scope untuk status verifikasi disetujui
     */
    public function scopeDisetujui($query)
    {
        return $query->where('status_verifikasi', 'disetujui');
    }

    /**
     * Scope untuk status verifikasi ditolak
     */
    public function scopeDitolak($query)
    {
        return $query->where('status_verifikasi', 'ditolak');
    }

    /**
     * Upload bukti transfer file
     */
    public static function uploadBuktiTransfer($file, $pembayaranId = null)
    {
        if (!$file) {
            return null;
        }

        $filename = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
        $file->storeAs('bukti-transfer', $filename, 'public');

        return $filename;
    }

    /**
     * Hapus file bukti transfer
     */
    public function deleteBuktiTransfer()
    {
        if ($this->bukti_transfer && \Storage::disk('public')->exists('bukti-transfer/' . $this->bukti_transfer)) {
            \Storage::disk('public')->delete('bukti-transfer/' . $this->bukti_transfer);
        }
    }
}
