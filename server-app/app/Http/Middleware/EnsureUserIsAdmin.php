<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $organizationId = session('organization_id');

        if (!$user || !$organizationId) {
            abort(403);
        }

        $isAdmin = $user->organizations()
            ->where('id', $organizationId)
            ->exists();

        if (!$isAdmin) {
            abort(403, 'No tienes permisos para acceder.');
        }
        return $next($request);
    }
}
