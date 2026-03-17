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

    // para los technician no importa si esta activa o no
    // (ahora cambio la relacion de 1 a muchos en pivot table, ahora los technician solo pueden pertenecer a una org)
    // los technician pueden obtener y modificar los datos sin tener la necesidad de tener una organizacion activa
    // para los admin activar o no activar una organizacion sirve para ver los datos de una u otra organizacion
    // si no tiene organizacion activa se quita la id de organizacio sessio y si el usuario intenta entrar en services 
    // products o users no se le permite y se le redirije a activar una organizacion
    public function list(Request $request)
    {
        $userId = $request->user()->id;
        $organizations = $this->organizationService->getByUserId($userId);
        return Inertia::render('organization/listOrganization',[
            'organizations' => $organizations,
        ]);
    }
    public function create()
    {
        return Inertia::render('organization/createOrganization');
    }
    public function show(Request $request)
    {
        $userId = $request->user()->id;
        $organization = $this->organizationService->getActive($userId);
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

        $result = $this->organizationService->create($data);

        session()->flash(
            $result->success ? 'message' : 'error',
            $result->message
        );

        return redirect()->route('organization.list.view');
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
        $result = $this->organizationService->update($dto, $file);
        session()->flash('message', $result->message);
        if (!$result->success) {
            session()->flash('error', $result->message);
        }
        return redirect()->route('organization.list.view');
    }

    public function delete(Request $request)
    {
        $result = $this->organizationService->delete($request->id);
        return response()->json([
            'code' => $result->code,
            'message' => $result->message,
            'success' => $result->success,
        ], $result->code);
    }
}
