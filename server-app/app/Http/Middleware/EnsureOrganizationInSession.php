<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationInSession
{
    /**
     * Handle an incoming request.
     *
     * Verifica en todas las rutas autenticadas que el usuario tenga una
     * organización activa en sesión. Si no la tiene, cierra la sesión y
     * redirige al login.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $organizationId = session('tenant_id');

        if (! $organizationId || ! Organization::whereKey($organizationId)->exists()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login');
        }

        return $next($request);
    }
}
