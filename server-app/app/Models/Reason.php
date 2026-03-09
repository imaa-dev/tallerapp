<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reason extends Model
{
    protected $fillable = [
        'servi_id',
        'diagnosis_id',
        'reason_note',
        'attend'
    ];
}
