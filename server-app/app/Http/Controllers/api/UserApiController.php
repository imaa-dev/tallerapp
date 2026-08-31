<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserApiController extends Controller
{
    use ApiResponse;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function list(Request $request)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $filters = $request->only([
            'search', 'email', 'rol',
            'sort', 'direction', 'page', 'per_page',
        ]);

        $users = $this->userService->getUserCreatedByOrganizationWithFile(
            $organizationId,
            $filters
        );

        return $this->success([
            'users' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
        ], 'Usuarios obtenidos correctamente', 200);
    }

    public function storeClient(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $client = \App\Models\User::create([
            'created_by_organization_id' => $organizationId,
            'name' => $request->name,
            'email' => $request->email,
            'rol' => 'CLIENT',
            'phone' => $request->phone,
        ]);

        return $this->success($client, 'Cliente creado correctamente', 201);
    }

    public function storeTechnician(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $technician = \App\Models\User::create([
            'created_by_organization_id' => $organizationId,
            'name' => $request->name,
            'email' => $request->email,
            'rol' => 'TECHNICIAN',
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        return $this->success($technician, 'Tecnico creado correctamente', 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        $user = $this->userService->update($request->only(['id', 'name', 'email', 'phone']));

        return $this->success($user, 'Usuario actualizado correctamente', 200);
    }

    public function delete(Request $request, int $id)
    {
        $this->userService->deleteClient($id);

        return $this->success(null, 'Usuario eliminado correctamente', 200);
    }
}
