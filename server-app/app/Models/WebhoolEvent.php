<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebhoolEvent extends Model
{
    protected $fillable = [
        'provider',
        'event_id',
        'event_type',
        'resource_id',
        'payload',
        'processed_at'
    ];
}
