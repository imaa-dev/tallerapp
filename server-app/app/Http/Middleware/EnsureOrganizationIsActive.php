<?php

namespace App\Http\Middleware;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Services\SubscriptionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationIsActive
{
    public function __construct(
        protected SubscriptionService $subscriptionService,
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $organizationId = session('tenant_id');
        $subscription = Subscription::where('organization_id', $organizationId)->firstOrFail();

        $this->subscriptionService->syncStatus($subscription);

        $errors = [
            SubscriptionStatus::Suspended->value => [
                'code' => 'ORGANIZATION_SUSPENDED',
                'message' => 'Su organización se encuentra suspendida.',
            ],

            SubscriptionStatus::Cancelled->value => [
                'code' => 'ORGANIZATION_CANCELLED',
                'message' => 'Su organización se encuentra cancelada.',
            ],

            SubscriptionStatus::Expired->value => [
                'code' => 'ORGANIZATION_EXPIRED',
                'message' => 'Su organización se encuentra expirada.',
            ],

            SubscriptionStatus::Pending->value => [
                'code' => 'ORGANIZATION_PAYMENT_PENDING',
                'message' => 'Su organización tiene un pago pendiente.',
            ],
        ];
        if (isset($errors[$subscription->status->value])) {
            $error = $errors[$subscription->status->value];
            if ($request->expectsJson()) {
                return response()->json($error, 403);
            }

            return redirect()
                ->route('subscription.form.view')
                ->with('error_code', $error['code'])
                ->with('error', $error['message']);
        }

        return $next($request);
    }
}
