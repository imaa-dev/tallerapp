<?php

namespace App\Http\Middleware;

use App\Enums\OrganizationStatus;
use App\Enums\SubscriptionStatus;
use App\Models\Organization;
use App\Models\Subscription;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $organizationId = session('tenant_id');

        $organization = Organization::find($organizationId);
        $subscription = Subscription::where('organization_id', $organizationId)->firstOrFail();
        $errors = [
            SubscriptionStatus::Suspected->value => [
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
        ];
        if (isset($errors[$subscription->status->value])) {
            $error = $errors[$subscription->status->value];

            if ($request->expectsJson()) {
                return response()->json($error, 403);
            }

            return redirect()
                ->back()
                ->with('error_code', $error['code'])
                ->with('error', $error['message']);
        }

        return $next($request);
    }
}
