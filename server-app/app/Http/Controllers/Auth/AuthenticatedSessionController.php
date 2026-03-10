<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // TODO
        $request->authenticate();
        $request->session()->regenerate();
        $user = Auth::user()->load(['organizations', 'assignedOrganizations']);

        // Primero intenta como ADMIN (owner)
        $organizationId = $user->organizations->first()?->id;

        // Si no tiene, intenta como TECHNICIAN
        if (!$organizationId) {
            $organizationId = $user->assignedOrganizations->first()?->id;
            session([
                'organization_id' => $organizationId
            ]);
            return redirect()->intended(route('services.view', absolute: false));
            
        }

        if ($organizationId) {
            session([
                'organization_id' => $organizationId
            ]);
        }
        
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
