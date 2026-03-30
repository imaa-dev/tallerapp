<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnosis extends Model
{
    protected $table = 'diagnosis';

    protected $fillable = [
        'servi_id',
        'diagnosis',
        'repair_time',
        'cost'
    ];
}
