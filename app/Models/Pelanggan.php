<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Pelanggan extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'pelanggan';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama',
        'email',
        'password',
        'nomor_meter',
        'alamat',
        'id_tarif',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    /**
     * Relasi ke model Tarif
     */
    public function tarif()
    {
        return $this->belongsTo(Tarif::class, 'id_tarif');
    }

    /**
     * Relasi ke model Penggunaan
     */
    public function penggunaan()
    {
        return $this->hasMany(Penggunaan::class, 'id_pelanggan');
    }

    /**
     * Relasi ke model Tagihan
     */
    public function tagihan()
    {
        return $this->hasMany(Tagihan::class, 'id_pelanggan');
    }
}
