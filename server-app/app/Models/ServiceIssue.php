<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceIssue extends Model
{
    protected $table = 'service_issues';

    protected $fillable = [
        'servi_id',
        'issue',
        'diagnosis',
        'repair_time',
        'cost',
        'attend',
    ];

    public function servi()
    {
        return $this->belongsTo(Servi::class, 'servi_id');
    }
}
