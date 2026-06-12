<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'status' => SubscriptionStatus::class,
    ];
    protected $fillable = ['user_id', 'plan_id', 'starts_at', 'ends_at', 'active', 'status', 'organization_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function payments()
    {
        return $this->hasMany(PaymentSubscription::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
