<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpareParts extends Model
{
    use HasFactory;

    protected $fillable = [
        'servi_id',
        'user_id',
        'organization_id',
        'model',
        'brand',
        'price',
        'note'
    ];

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('model', 'like', "%{$search}%")
                        ->orWhere('brand', 'like', "%{$search}%")
                        ->orWhere('note', 'like', "%{$search}%");
                });
            })
            ->when($filters['brand'] ?? null, function ($query, $brand) {
                $query->where('brand', 'like', "%{$brand}%");
            })
            ->when($filters['model'] ?? null, function ($query, $model) {
                $query->where('model', 'like', "%{$model}%");
            });
    }

    public function scopeByOrganization($query, int $organization_id)
    {
        return $query->where('organization_id', $organization_id);
    }

    public function service()
    {
        return $this->belongsTo(Servi::class, 'servi_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
}
