<?php

namespace App\Services;

use App\Models\Subscription;


class SubscriptionService 
{

    public function getSubscription(int $organization_id)
    {
        return Subscription::where('organization_id', $organization_id)->with('plan')->sole();

    }
}