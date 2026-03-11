<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Services\OrganizationService;
use App\Services\OrganizationContextService;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */

    protected OrganizationService $organizationService;
    protected OrganizationContextService $organizationContext;

    public function __construct(OrganizationService $organizationService, OrganizationContextService $organizationContext){
        $this->organizationService = $organizationService;
        $this->organizationContext = $organizationContext;
    }

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
        // mejorar logica, trabajar con organizacion activa
        $request->authenticate();

        $request->session()->regenerate();
        $user = Auth::user()->load(['organizations', 'assignedOrganizations']);
        $organizationActive = $this->organizationService->getActive($user->id);

        if ($user->rol === 'ADMIN') {

            $this->organizationContext->setActive($organizationActive->id);

        }

        if ($user->rol === 'TECHNICIAN') {

            $organization = $user->assignedOrganizations->first();

            if (!$organization) {
                Auth::logout();
                return redirect()->route('login');
            }

            $this->organizationContext->setActive($organization->id);

            return redirect()->intended(route('services.view'));
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
