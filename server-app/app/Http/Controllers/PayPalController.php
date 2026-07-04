<?php

namespace App\Http\Controllers;

use App\Services\PayPalService;
use App\Services\PaymentService;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Subscription;
use Inertia\Inertia;

class PayPalController extends Controller
{
    public function create(
    Request $request,
    PayPalService $paypal
) {
    $request->validate([
        'plan_id' => ['required', 'string'],
    ]);
    $paypalResponse = $paypal->createSubscription(
        planId: $request->plan_id,
        returnUrl: url('/paypal/success'),
        cancelUrl: url('/paypal/cancel')
    );

    

    $subscription = Subscription::where('organization_id', session('tenant_id'))
        ->firstOrFail();

    $approveLink = collect($paypalResponse['links'])
        ->firstWhere('rel', 'approve')['href'] ?? null;
    $subscription->update([
        'provider' => 'paypal',
        'provider_subscription_id' => $paypalResponse['id'],
        'status' => 'pending', // transición importante
        'provider_metadata' => [
            'approve_url' => $approveLink,
            'paypal_status' => $paypalResponse['status'],
            'create_time' => $paypalResponse['create_time'],
        ],
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Suscripción creada correctamente.',
        'data' => [
            'subscription_id' => $paypalResponse['id'],
            'approve_url' => $approveLink
        ],
    ]);
}

public function success(Request $request)
{
    return redirect()->route('subscription.form.view')
        ->with('message', 'Pago procesado correctamente');
}

}