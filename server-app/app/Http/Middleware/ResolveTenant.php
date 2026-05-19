<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenantId = session('tenant_id');

        if (!$tenantId) {
            return response()->json([
                'message' => 'Tenant not selected'
            ], 400);
        }

        $tenant = Organization::find($tenantId);

        if (!$tenant) {
            return response()->json([
                'message' => 'Organization not found'
            ], 404);
        }

        app()->instance('tenant', $tenant);

        return $next($request);
    }
}
