<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceAccessToken extends Model
{
    protected $table = 'service_access_tokens';

    protected $fillable = [
        'servi_id',
        'status',
        'token',
        'client_accessed',
        'pdf_downloaded',
    ];

    protected $casts = [
        'client_accessed' => 'boolean',
        'pdf_downloaded' => 'boolean',
    ];

    public function servi()
    {
        return $this->belongsTo(Servi::class, 'servi_id');
    }
}
