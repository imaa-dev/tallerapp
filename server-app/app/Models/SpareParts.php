<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpareParts extends Model
{
    use HasFactory;

    protected $fillable = [
        'servi_id',
        'user_id',
        'model',
        'brand',
        'price',
        'note'
    ];
}
