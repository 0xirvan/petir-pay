<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    protected $table = 'tarif';

    protected $fillable = [
        'daya',
        'tarif_per_kwh',
        'deskripsi',
    ];
}
