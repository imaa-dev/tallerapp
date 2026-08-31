<?php

namespace App\Http\Controllers\api\Auth;

use App\Enums\OrganizationStatus;
use App\Enums\SubscriptionStatus;
use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Models\WorkshopType;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\UserService;
use App\Services\OrganizationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    private UserService $userService;
    private OrganizationService $organizationService;

    public function __construct(
        UserService $userService,
        OrganizationService $organizationService
    ) {
        $this->userService = $userService;
        $this->organizationService = $organizationService;
    }

    public function store(LoginRequest $request)
    {
        return response()->json(
            $this->userService->authLogin(
                $request->email,
                $request->password
            )
        );
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nameOrganization' => 'required|string|max:255',
            'workshop_type_id' => 'required|exists:workshop_types,id',
        ]);

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'rol' => 'ADMIN',
            ]);

            $organization = $this->organizationService->create([
                'user_id' => $user->id,
                'name' => $request->nameOrganization,
                'description' => ' ',
                'workshop_type_id' => $request->workshop_type_id,
                'status' => OrganizationStatus::Active,
            ]);

            $trialPlan = Plan::where('slug', 'profesional')->firstOrFail();

            Subscription::create([
                'organization_id' => $organization->id,
                'plan_id' => $trialPlan->id,
                'starts_at' => Carbon::now(),
                'ends_at' => Carbon::now()->addDays(14),
                'status' => SubscriptionStatus::Trial,
            ]);

            return response()->json(
                $this->userService->createTokenForOrganization(
                    $user,
                    $organization,
                    $user->email
                )
            );
        });
    }

    public function completeLogin(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'organization_id' => 'required|integer|exists:organizations,id',
        ]);

        $parts = explode('_', $request->login_id);
        $userId = (int) $parts[0];

        return response()->json(
            $this->userService->completeLogin($userId, $request->organization_id)
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Logout exitoso',
        ]);
    }
}
