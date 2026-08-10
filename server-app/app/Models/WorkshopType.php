<?php

namespace App\Models;

use App\Models\MotorWork;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkshopType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class);
    }

    public function motorWorks(): HasMany
    {
        return $this->hasMany(MotorWork::class);
    }
}
