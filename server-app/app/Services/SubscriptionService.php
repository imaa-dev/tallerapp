<?php

namespace App\Services;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;

class SubscriptionService
{
    public function getSubscription(int $organization_id)
    {
        return Subscription::where('organization_id', $organization_id)->with('plan')->firstOrFail();
    }

    public function syncStatus(Subscription $subscription): bool
    {
        if (! $subscription->ends_at || $subscription->ends_at->isFuture()) {
            return false;
        }

        $target = match ($subscription->status) {
            SubscriptionStatus::Trial => SubscriptionStatus::Expired,
            SubscriptionStatus::Active => SubscriptionStatus::Pending,
            default => null,
        };

        if ($target === null) {
            return false;
        }

        $subscription->update(['status' => $target]);

        return true;
    }
}
