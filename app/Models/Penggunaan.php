<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Penggunaan extends Model
{
    protected $table = "penggunaan";

    protected $fillable = [
        'id_pelanggan',
        'bulan',
        'tahun',
        'meter_awal',
        'meter_akhir',
    ];

    protected $appends = [
        'jumlah_kwh',
    ];

    /**
     * Accessor untuk menghitung jumlah kWh
     */
    public function getJumlahKwhAttribute(): int
    {
        return max(0, $this->meter_akhir - $this->meter_awal);
    }

    public function pelanggan(): BelongsTo
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan');
    }
}
