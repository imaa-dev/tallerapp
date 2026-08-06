<?php

namespace App\Http\Controllers;

use App\Enums\ServiceStatus;
use App\Http\Requests\StoreServiceRequest;
use App\Models\Servi;
use App\Services\OrganizationService;
use App\Services\ProductService;
use App\Services\ServiService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiController extends Controller
{
    protected ServiService $serviService;

    protected OrganizationService $organizationService;

    protected ProductService $productService;

    protected UserService $userService;

    public function __construct(
        ServiService $serviService,
        OrganizationService $organizationService,
        ProductService $productService,
        UserService $userService
    ) {
        $this->serviService = $serviService;
        $this->organizationService = $organizationService;
        $this->productService = $productService;
        $this->userService = $userService;
    }

    public function show(Request $request)
    {
        $organizationId = session('tenant_id');
        $user = $request->user();
        if (! $organizationId) {

            $message = '';

            if ($user->rol === 'ADMIN') {
                $message = 'No tienes una organización creada. Debes crear una organización para comenzar.';
            }

            if ($user->rol === 'TECHNICIAN') {
                $message = 'No tienes una organización asignada. Contacta a un administrador.';
            }

            return Inertia::render('service/service', [
                'countTypeService' => [],
                'notOrganization' => true,
                'message' => $message,
                'user_rol' => $user->rol,
            ]);
        }

        $countTypeService = $this->serviService
            ->getCountTypeService($organizationId);

        return Inertia::render('service/service', [
            'countTypeService' => $countTypeService,
            'notOrganization' => false,
            'message' => null,
            'user_rol' => $user->rol,
        ]);
    }

    public function listReception(Request $request)
    {
        $organizationId = session('tenant_id');
        $servi = $this->serviService->getTypeService($organizationId, ServiceStatus::Reception);

        return Inertia::render('service/listService', [
            'services' => $servi,
            'title' => 'Recepcionando',
            'statusColor' => 'bg-blue-500',
        ]);
    }

    public function listDiagnosis(Request $request)
    {
        $organizationId = session('tenant_id');
        $result = $this->serviService->getTypeService($organizationId, ServiceStatus::Diagnosis);

        return Inertia::render('service/listService', [
            'services' => $result,
            'title' => 'Diagnostico',
            'statusColor' => 'bg-violet-400',
        ]);
    }

    public function listToSparePart(Request $request)
    {

        $organizationId = session('tenant_id');
        $result = $this->serviService->getTypeService($organizationId, ServiceStatus::SparePartApproval);

        return Inertia::render('service/listService', [
            'services' => $result,
            'title' => 'Aprovación de repuestos',
            'statusColor' => 'bg-orange-400',
        ]);
    }

    public function listRepair(Request $request)
    {
        $organizationId = session('tenant_id');
        $result = $this->serviService->getTypeService($organizationId, ServiceStatus::InRepair);

        return Inertia::render('service/listService', [
            'services' => $result,
            'title' => 'En Reparación',
            'statusColor' => 'bg-gray-400',
        ]);
    }

    public function listRepaired(Request $request)
    {
        $organizationId = session('tenant_id');
        $result = $this->serviService->getTypeService($organizationId, ServiceStatus::Repaired);

        return Inertia::render('service/listService', [
            'services' => $result,
            'title' => 'Reparado',
            'statusColor' => 'bg-blue-400',
        ]);
    }

    public function listdelivered(Request $request)
    {
        $organizationId = session('tenant_id');
        $result = $this->serviService->getTypeService($organizationId, ServiceStatus::Delivered);

        return Inertia::render('service/listService', [
            'services' => $result,
            'title' => 'Entregado',
            'statusColor' => 'bg-green-400',
        ]);
    }

    public function listIncident(Request $request)
    {
        $organizationId = session('tenant_id');
        $result = $this->serviService->getTypeService($organizationId, ServiceStatus::Incident);

        return Inertia::render('service/listService', [
            'services' => $result,
            'title' => 'Incidencias',
            'statusColor' => 'bg-red-500',
        ]);
    }

    public function create(Request $request)
    {
        $organizationId = session('tenant_id');
        $product = $this->productService->getByOrganizationId($organizationId);
        $client = $this->userService->listClientsByOrganization($organizationId);

        return Inertia::render('service/createServis', [
            'products' => $product,
            'clients' => $client,
        ]);
    }

    public function store(StoreServiceRequest $request)
    {
        $organization = auth()
            ->user()
            ->currentOrganization();

        if (! auth()->user()->can(
            'createService',
            $organization
        )) {
            abort(403);
        }

        $this->serviService->create(
            $request->validated(),
            $request->file('file'),
            $request->user()->id,
            $request->input('reason_notes')
        );

        return redirect()
            ->route('services.list.reception.view')
            ->with('message', 'Servicio creado correctamente');
    }

    public function getUpdate(Request $request, Servi $servi)
    {
        $serviceFile = $this->serviService->getServiceWithProductClientFileReasonDiagnosis($servi->id);
        $organization_id = session('tenant_id');
        $products = $this->productService->getByOrganizationId($organization_id);
        $clients = $this->userService->listClientsByOrganization($organization_id);

        return Inertia::render('service/manageService', [
            'servi' => $serviceFile,
            'clients' => $clients,
            'products' => $products,
        ]);
    }

    public function update(Request $request)
    {
        $res = $this->serviService->update($request->all());

        return redirect()->route('services.view')
            ->with('message', 'Servicio actualizado satisfactoriamente');
    }

    public function delete(int $id)
    {
        $this->serviService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Servicio eliminado satisfactoriamente',
        ]);
    }

    public function toDiagnosis(Request $request)
    {
        $notify = $request->notification_client;
        $this->serviService->updateStatusServiceNotifyInspect($request->service_id, ServiceStatus::Diagnosis, $notify);

        return redirect()->route('services.view')
            ->with('message', 'Servicio actualizado satisfactoriamente');
    }

    public function toAproveSpareParts(Request $request)
    {
        $this->serviService->updateStatusService($request->id, ServiceStatus::SparePartApproval);

        return response()->json([
            'success' => true,
            'message' => 'Servicio actualizado satisfactoriamente',
        ]);
    }

    public function toRepaired(Request $request)
    {
        $notify = $request->notification_client;
        $this->serviService->updateStatusServiceNotifyRepair($request->service_id, ServiceStatus::InRepair, $notify);

        return redirect()->route('services.view')
            ->with('message', 'Servicio actualizado satisfactoriamente');
    }

    public function repairService(Request $request)
    {
        $service_id = $request->service_id;
        $repair_price = $request->repair_price;
        $final_note = $request->final_note;
        $organization_id = session('tenant_id');
        $this->serviService->repairServiceNotifyClient($service_id, ServiceStatus::Repaired, $repair_price, $final_note, $organization_id);

        return redirect()->route('services.view')
            ->with('message', 'Servicio actualizado satisfactoriamente');
    }

    public function toDelivered(Request $request)
    {
        $this->serviService->updateStatusService($request->service_id, ServiceStatus::Delivered);

        return redirect()->route('services.view')
            ->with('message', 'Servicio entregado');
    }

    public function toIncident(Request $request)
    {
        $this->serviService->updateStatusService($request->service_id, ServiceStatus::Incident);

        return redirect()->route('services.view')
            ->with('message', 'Servicio en incidencia');
    }

    public function toGoBack(Request $request)
    {
        $currentStatus = ServiceStatus::tryFrom((int) $request->status_service_id);

        if (! $currentStatus) {
            abort(422, 'Estado de servicio inválido');
        }

        $this->serviService->goBack($request->service_id, $currentStatus);

        return redirect()->route('services.view')
            ->with('message', 'Servicio actualizado correctamente');
    }
}
