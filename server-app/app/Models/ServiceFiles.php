<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceFiles extends Model
{
    protected $fillable = [
        'servi_id',
        'status_service_id',
        'file_id '
    ];
}
