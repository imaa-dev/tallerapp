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
        'provider_prices',
    ];

    protected $casts = [
        'price' => 'float',
        'is_active' => 'boolean',
        'provider_plans' => 'array',
        'provider_prices' => 'array',
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

    public function providerPrice(string $provider): ?array
    {
        $pricing = $this->provider_prices[$provider] ?? null;

        if (! is_array($pricing)) {
            return null;
        }

        if (
            ! isset($pricing['amount'], $pricing['currency'])
            || ! is_numeric($pricing['amount'])
        ) {
            return null;
        }

        return [
            'amount' => (float) $pricing['amount'],
            'currency' => strtoupper($pricing['currency']),
        ];
    }

    public function setProviderPlanId(string $provider, string $planId): void
    {
        $plans = $this->provider_plans ?? [];
        $plans[$provider] = $planId;
        $this->provider_plans = $plans;
        $this->save();
    }
}
