<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = ['name', 'price', 'interval', 'duration_days', 'features'];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
