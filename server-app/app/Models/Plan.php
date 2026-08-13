<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'price',
        'description',
        'billing_period',
        'is_active',
        'provider_plans',
    ];

    protected $casts = [
        'price' => 'float',
        'is_active' => 'boolean',
        'provider_plans' => 'array',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function planFeatures(): HasMany
    {
        return $this->hasMany(PlanFeature::class);
    }

    public function providerPlanId(string $provider): ?string
    {
        return $this->provider_plans[$provider] ?? null;
    }

    public function setProviderPlanId(string $provider, string $planId): void
    {
        $plans = $this->provider_plans ?? [];
        $plans[$provider] = $planId;
        $this->provider_plans = $plans;
        $this->save();
    }
}
