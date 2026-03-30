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
        $organizationId = session('organization_id');
        $users = $this->userService->getUserCreatedByOrganizationWithFile($organizationId);
        $organizations = $this->organizationService->getAllByUser($request->user()->id);
        return Inertia::render('users/users', [
            'users' => $users,
            'organizations' => $organizations,
        ]);
    }

    public function listClients(Request $request)
    {
        $organizationId = session('organization_id');
        $clients = $this->userService->listClients($organizationId);
        return Inertia::render('users/clients', [
            'clients' => $clients
        ]);    
    }
    public function updateClient(Request $request)
    {
        $data = $request->only(['id', 'name', 'email', 'phone']);

        $res = $this->userService->update($data);

        session()->flash('message', $res->message);

        return redirect()->route('users.client.list.view');
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
        $result = $this->userService->createClient($dto);
        return response()->json([
            'success' => $result->success,
            'message' => $result->message,
            'code'    => $result->code,
            'data'    => $result->data,
        ]);
    }

    public function storeTechnician(StoreTechnicianRequest $request)
    {
        $dto = new CreateTechnicianDTO($request);
        $result =  $this->userService->createTechnician($dto);
        return response()->json([
            'success' => $result->success,
            'message' => $result->message,
            'code'    => $result->code,
            'data'    => $result->data,
        ]);
    }

    public function deleteClient(Request $request)
    {
        $res = $this->userService->deleteClient($request->id);
        return response()->json([
            'success' => $res->success,
            'code'    => $res->code,
            'message' => $res->message
        ]);
    }
}
