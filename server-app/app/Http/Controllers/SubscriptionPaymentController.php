<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Subscription;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubscriptionPaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
    ) {}

    public function create(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => ['required', 'integer'],
            'provider' => ['nullable', 'string', 'in:paypal,mercadoPago'],
        ]);

        $provider = $validated['provider'] ?? 'paypal';

        $plan = Plan::where('id', $validated['plan_id'])
            ->where('is_active', true)
            ->firstOrFail();

        $organizationId = session('tenant_id');

        $subscription = Subscription::where('organization_id', $organizationId)
            ->firstOrFail();

        $customer = [
            'payer_email' => $subscription->organization?->email
                ?? Auth::user()?->email,
        ];

        $result = $this->paymentService->createSubscription(
            provider: $provider,
            plan: $plan,
            subscription: $subscription,
            returnUrl: url('/subscribe/success'),
            cancelUrl: url('/subscribe/cancel'),
            customer: $customer,
        );

        $subscription->update([
            'plan_id' => $plan->id,
            'provider' => $provider,
            'provider_subscription_id' => $result['provider_subscription_id'],
            'status' => 'pending',
            'provider_metadata' => [
                'approve_url' => $result['approve_url'],
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Suscripción creada correctamente.',
            'data' => [
                'subscription_id' => $result['provider_subscription_id'],
                'approve_url' => $result['approve_url'],
            ],
        ]);
    }

    public function cancelSubscription(Request $request)
    {
        $organizationId = session('tenant_id');

        $subscription = Subscription::where('organization_id', $organizationId)
            ->firstOrFail();

        $this->paymentService->cancelSubscription($subscription);

        return redirect()
            ->route('subscription.form.view')
            ->with('message', 'Suscripción cancelada correctamente.');
    }

    public function success(Request $request)
    {
        return redirect()
            ->route('subscription.form.view')
            ->with('message', 'Pago procesado correctamente');
    }

    public function cancel(Request $request)
    {
        return redirect()
            ->route('subscription.form.view')
            ->with('message', 'Pago cancelado');
    }
}
