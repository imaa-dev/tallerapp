<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairDocument extends Model
{
    protected $fillable = [
        'service_id',
        'organization_id',
        'type',
        'filename',
        'path',
        'created_at'
    ];
}
