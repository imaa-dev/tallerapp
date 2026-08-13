<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\SubscriptionService;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected SubscriptionService $subscriptionService;

    public function __construct(
        SubscriptionService $subscriptionService
    ) {
        $this->subscriptionService = $subscriptionService;
    }

    public function showSubscriptionForm()
    {
        $organization_id = session('tenant_id');
        $subscription = $this->subscriptionService->getSubscription($organization_id);

        $this->subscriptionService->syncStatus($subscription);

        $plans = Plan::where('is_active', true)
            ->with('planFeatures')
            ->orderBy('price')
            ->get();

        return Inertia::render('payments/paymentsAndSubscriptions', [
            'subscription' => $subscription,
            'plans' => $plans,
        ]);
    }
}
