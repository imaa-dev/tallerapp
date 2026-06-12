<?php

namespace App\Http\Middleware;

use App\Enums\OrganizationStatus;
use App\Models\Organization;
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

        if (
            !$organization ||
            in_array($organization->status, [
                OrganizationStatus::Blocked,
                OrganizationStatus::Inactive,
            ])
        ) {

            if ($request->expectsJson()) {
                return response()->json([
                    'code' => 'ORGANIZATION_SUSPENDED',
                    'message' => 'Su organizacion se encuentra Suspendida'
                ], 403);
            }

            return redirect()
                ->back()
                ->with('error_code', 'ORGANIZATION_SUSPENDED')
                ->with('error', 'La suscripción de la organización se encuentra suspendida.');
        }

        return $next($request);
    }
}
