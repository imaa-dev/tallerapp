<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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

    public function scopeFilter(
        Builder $query,
        array $filters
    ): Builder
    {
        return $query

            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('filename', 'like', "%{$search}%");
            })

            ->when($filters['service_id'] ?? null, function ($query, $serviceId) {
                $query->where('service_id', $serviceId);
            })

            ->when($filters['type'] ?? null, function ($query, $type) {
                $query->where('type', $type);
            })

            ->when($filters['from'] ?? null, function ($query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })

            ->when($filters['to'] ?? null, function ($query, $to) {
                $query->whereDate('created_at', '<=', $to);
            });
    }
}
