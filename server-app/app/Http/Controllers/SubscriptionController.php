<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\SubscriptionService;

class SubscriptionController extends Controller
{

    protected SubscriptionService $subscriptionService;

    public function __construct(
        SubscriptionService $subscriptionService
    )
    {
        $this->subscriptionService = $subscriptionService;
    }
    public function showSubscriptionForm()
    {
        $organization_id = session('tenant_id');
        $subscription = $this->subscriptionService->getSubscription($organization_id);

        return Inertia::render('payments/paymentsAndSubscriptions', [
            'subscription' => $subscription
        ]);
    }

    
}
