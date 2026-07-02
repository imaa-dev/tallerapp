<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query

            ->when($filters['search'] ?? null, function ($query, $search) {

                $query->where(function ($query) use ($search) {

                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('model', 'like', "%{$search}%");

                });

            })

            ->when($filters['brand'] ?? null, function ($query, $brand) {

                $query->where('brand', 'like', "%{$brand}%");

            })

            ->when($filters['model'] ?? null, function ($query, $model) {

                $query->where('model', 'like', "%{$model}%");

            });
    }
}
