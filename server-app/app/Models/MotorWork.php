<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MotorWork extends Model
{
    use HasFactory;

    protected $fillable = [
        'workshop_type_id',
        'motor_work_category_id',
        'name',
    ];

    public function workshopType(): BelongsTo
    {
        return $this->belongsTo(WorkshopType::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MotorWorkCategory::class, 'motor_work_category_id');
    }
}
