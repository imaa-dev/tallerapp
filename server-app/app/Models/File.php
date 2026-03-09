<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'path',
        'fileable_type',
        'fileable_id'
    ];

    public function fileable()
    {
        return $this->morphTo();
    }
}
