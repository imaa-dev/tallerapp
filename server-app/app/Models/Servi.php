<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Servi extends Model
{

     use HasFactory;

     protected $fillable = [
        'uuid',
        'user_id',
        'organization_id',
        'product_id',
        'status_id',
        'date_entry',
        'date_exit',
        'satisfied',
        'repair_price',
        'final_note',
        'approve_spare_parts'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function client()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
    public function file()
    {
        return $this->morphMany(File::class, 'fileable');
    }
    public function reasons()
    {
        return $this->hasMany(Reason::class);
    }
    public function diagnosis()
    {
        return $this->hasMany(Diagnosis::class);
    }
    public function status()
    {
        return $this->belongsTo(StatusService::class);
    }

    public function spareparts()
    {
        return $this->hasMany(SpareParts::class);
    }

    public function scopeForOrganization($query, int $organization_id)
    {
        return $query->where('organization_id', $organization_id);
    }

    public function scopeForStatus($query, int $status_id)
    {
        return $query->where('status_id', $status_id);
    }

    public function scopeForServiceId($query, int $service_id)
    {
        return $query->where('id', $service_id);
    }

    public function scopeWithFullRelations($query)
    {
        return $query->with([
            'file',
            'product',
            'client',
            'reasons',
            'status',
            'diagnosis',
            'spareparts'
        ]);
    }
}
