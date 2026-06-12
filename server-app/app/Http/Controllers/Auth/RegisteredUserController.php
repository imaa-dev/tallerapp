<?php

namespace App\Http\Controllers\Auth;

use App\Enums\OrganizationStatus;
use App\Enums\SubscriptionStatus;
use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\OrganizationService;
use App\Services\OrganizationContextService;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    protected OrganizationService $organizationService;
    protected OrganizationContextService $organizationContext;
    public function __construct(OrganizationService $organizationService,
    OrganizationContextService $organizationContext)
    {
        $this->organizationService = $organizationService;
        $this->organizationContext = $organizationContext;
    }

    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'rol' => 'ADMIN'
        ]);
        $data = [
            'user_id' => $user->id,
            'name' => $request->nameOrganization,
            'description' => $request->description,
            'status' => OrganizationStatus::Active,
            'file' => $request->file('file'),
        ];
        $organizationResult = $this->organizationService->create($data);
        Subscription::create([
            'organization_id' => $organizationResult->data->id,
            'plan_id' => Plan::FREE,
            'starts_at' => Carbon::now(),
            'ends_at' => Carbon::now()->addDays(14),
            'status' => SubscriptionStatus::Trial
        ]);
        if (!$organizationResult->success) {
            return back()->withErrors($organizationResult->message);
        }
        $organization = $organizationResult->data;
        $this->organizationContext->setActive($organization->id);
        event(new Registered($user));

        Auth::login($user);

        return to_route('select.organization');
    }
}
