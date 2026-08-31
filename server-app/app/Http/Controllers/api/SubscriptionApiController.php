<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;

class SubscriptionApiController extends Controller
{
    use ApiResponse;

    protected SubscriptionService $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    public function show(Request $request)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;
        $subscription = $this->subscriptionService->getSubscription($organizationId);
        $this->subscriptionService->syncStatus($subscription);

        return $this->success($subscription, 'Suscripcion obtenida correctamente', 200);
    }

    public function plans()
    {
        $plans = Plan::where('is_active', true)
            ->with('planFeatures')
            ->orderBy('price')
            ->get();

        return $this->success($plans, 'Planes obtenidos correctamente', 200);
    }
}
