<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentSubscription extends Model
{
    protected $fillable = ['subscription_id', 'amount', 'currency', 'method', 'transaction_id', 'status'];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
