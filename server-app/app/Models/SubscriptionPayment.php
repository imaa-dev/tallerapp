<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionPayment extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REFUNDED = 'refunded';

    public const STATUS_PARTIALLY_REFUNDED = 'partially_refunded';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'subscription_id',
        'provider',
        'provider_payment_id',
        'provider_capture_id',
        'payer_id',
        'amount',
        'currency',
        'status',
        'paid_at',
        'payload',
    ];

    protected $casts = [
        'amount' => 'float',
        'paid_at' => 'datetime',
        'payload' => 'array',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
