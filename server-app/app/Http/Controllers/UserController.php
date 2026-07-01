<?php

namespace App\Http\Controllers;

use App\DTO\CreateClientDTO;
use App\DTO\CreateTechnicianDTO;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\StoreTechnicianRequest;
use App\Models\User;
use App\Services\UserService;
use App\Services\OrganizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected UserService $userService;
    protected OrganizationService $organizationService;

    public function __construct(UserService $userService, OrganizationService $organizationService)
    {
        $this->userService = $userService;
        $this->organizationService = $organizationService;
    }
    public function create()
    {
        return Inertia::render('users/createClient');
    }

    public function createTechnician()
    {
        return Inertia::render('users/createTechnician');
    }

    public function listUsers(Request $request)
    {
        $organization_id = session('tenant_id');
        $users = $this->userService->getUserCreatedByOrganizationWithFile($organization_id);
        $organizations = $this->organizationService->getAllByUser($request->user()->id);
        return Inertia::render('users/users', [
            'users' => $users,
            'organizations' => $organizations,
        ]);
    }

    public function listClients(Request $request)
    {
        $organization_id = session('tenant_id');
        $clients = $this->userService->listClients($organization_id);
        return Inertia::render('users/clients', [
            'clients' => $clients
        ]);    
    }
    public function updateClient(Request $request)
    {
        $data = $request->only(['id', 'name', 'email', 'phone']);
        $user = $this->userService->update($data);
        return redirect()->route('user.client.view')
            ->with('message', 'Usuario cliente actualizado satisfactoriamente');
    }
    public function getUpdateClient(User $user)
    {
        $client = $this->userService->getClientById($user->id);
        return Inertia::render('users/editClient', [
            'client' => $client
        ]);
    }

    public function storeClient(StoreClientRequest $request)
    {
        $dto = new CreateClientDTO($request);
        $this->userService->createClient($dto);
        return response()->json([
            'success' => true,
            'message' => 'Usuario cliente creado satisfactoriamente',
        ]);
    }

    public function storeTechnician(StoreTechnicianRequest $request)
    {
        $dto = new CreateTechnicianDTO($request);
        $this->userService->createTechnician($dto);
        return response()->json([
            'success' => true,
            'message' => 'Usuario tecnico creado satisfactoriamente',
        ]);
    }

    public function deleteClient(Request $request)
    {
        $this->userService->deleteClient($request->id);
        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado satisfactoriamente'
        ]);
    }
}
