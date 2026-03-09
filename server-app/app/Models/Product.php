<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'brand',
        'model'
    ];

    public function servis()
    {
        return $this->hasMany(Servi::class);
    }
}
