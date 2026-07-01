<?php

namespace App\Http\Controllers;

use App\DTO\CreateOrganizationDTO;
use App\Http\Requests\StoreOrganizationRequest;
use App\Models\Organization;
use App\Services\OrganizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{

    protected OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    public function list(Request $request)
    {
        $userId = $request->user()->id;
        $organizations = $this->organizationService->getByUserIdWithSubscription($userId);
        return Inertia::render('organization/listOrganization',[
            'organizations' => $organizations,
        ]);
    }
    public function selectOrganization(Request $request)
    {
        $userId = $request->user()->id;
        $organizations = $this->organizationService->getByUserId($userId);
        return Inertia::render('organization/selectOrganization', [
            'organizations' => $organizations,
        ]);
    }

    public function setOrganization(Request $request)
    {
        $organizationId = $request->organization_id;
        $organization = $this->organizationService->getById($organizationId);
        session([
            'tenant_id' => $organization->id
        ]);
        return response()->json([
            'message' => 'Organizacion seleccionada satisfactoriamente',
            'success' => true
        ]);
    }
    public function create()
    {
        return Inertia::render('organization/createOrganization');
    }
    public function show(Request $request)
    {
        $userId = $request->user()->id;
        $organization = $this->organizationService->getById(session('tenant_id'));
        return Inertia::render('organization/organization', [
            'organization' => $organization
        ]);
    }
    public function store(StoreOrganizationRequest $request)
    {
        $data = [
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
            'active' => $request->boolean('active'),
            'file' => $request->file('file'),
        ];
        $this->organizationService->create($data);
        return redirect()->route('organization.list.view')
            ->with('message', 'Organizacion creada satisfactoriamente');
    }
    public function getUpdate(Organization $organization)
    {
        $organizationFile = $this->organizationService->getById($organization->id);
        return Inertia::render('organization/editOrganization',[
            'organizationUpdate' => $organizationFile,
        ]);
    }
    public function update(StoreOrganizationRequest $request)
    {
        $dto = new CreateOrganizationDTO($request);
        $file = $request->file('file');
        $this->organizationService->update($dto, $file);
        return redirect()->route('organization.list.view')
            ->with('message', 'Organization actualizada satisfactoriamente');
    }

    public function delete(Request $request)
    {
        $this->organizationService->delete($request->id);
        return response()->json([
            'message' => 'Organizacion eliminada satisfactoriamente',
            'success' => true,
        ]);
    }
}
