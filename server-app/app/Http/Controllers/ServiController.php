<?php

namespace App\Http\Controllers;

use App\Enums\ServiceAccessStatus;
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
            'title' => 'Repuestos',
            'statusColor' => 'bg-orange-400',
        ]);
    }

    public function listCostApproval(Request $request)
    {
        $organizationId = session('tenant_id');
        $result = $this->serviService->getTypeService($organizationId, ServiceStatus::CostApproval);

        return Inertia::render('service/listService', [
            'services' => $result,
            'title' => 'Aprobación de Costos',
            'statusColor' => 'bg-teal-500',
        ]);
    }

    public function finalRepairLink(Request $request)
    {
        $notificate_whatsapp = $request->boolean('notificate_whatsapp');

        $access = $this->serviService->ensureServiceAccessToken($request->service_id, ServiceAccessStatus::FinalRepair);
        $link = rtrim((string) config('app.public_url'), '/').'/final/'.$access->token;

        return response()->json([
            'success' => true,
            'message' => 'Enlace de reparación final generado.',
            'link' => $link,
            'whatsapp_url' => $notificate_whatsapp
                ? $this->serviService->buildWhatsappUrl($request->service_id, ServiceAccessStatus::FinalRepair)
                : null,
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
            $request->input('issues')
        );

        return redirect()
            ->route('services.list.reception.view')
            ->with('message', 'Servicio creado correctamente');
    }

    public function getUpdate(Request $request, Servi $servi)
    {
        $serviceFile = $this->serviService->getServiceWithProductClientFileServiceIssues($servi->id);
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
        $method = $request->input('approval_method', 'verbal');

        if (! in_array($method, ['email', 'whatsapp', 'verbal'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Método de aprobación inválido.',
            ], 422);
        }

        $whatsapp_url = $this->serviService->sendStartRepairApproval($request->service_id, $method);

        $message = match ($method) {
            'email' => 'Solicitud de aprobación enviada al correo del cliente. El servicio pasará a diagnóstico cuando sea aprobado.',
            'whatsapp' => 'Enlace de aprobación enviado por WhatsApp. El servicio pasará a diagnóstico cuando sea aprobado.',
            default => 'Servicio aprobado verbalmente y enviado a diagnóstico.',
        };

        return response()->json([
            'success' => true,
            'message' => $message,
            'whatsapp_url' => $whatsapp_url,
        ]);
    }

    public function toAproveSpareParts(Request $request)
    {
        $this->serviService->updateStatusService($request->id, ServiceStatus::SparePartApproval);

        return response()->json([
            'success' => true,
            'message' => 'Servicio enviado a la sección de repuestos.',
        ]);
    }

    public function toCostApproval(Request $request)
    {
        $this->serviService->toCostApproval($request->service_id);

        return response()->json([
            'success' => true,
            'message' => 'Servicio enviado a la sección de aprobación de costos.',
        ]);
    }

    public function sendCostApproval(Request $request)
    {
        $method = $request->input('approval_method', 'verbal');

        if (! in_array($method, ['email', 'whatsapp', 'verbal'], true)) {
            return response()->json([
                'success' => false,
                'message' => 'Método de aprobación inválido.',
            ], 422);
        }

        $whatsapp_url = $this->serviService->sendCostApproval($request->service_id, $method);

        $message = match ($method) {
            'email' => 'Aprobación de costos enviada al correo del cliente. El servicio pasará a reparación cuando sea aprobado.',
            'whatsapp' => 'Aprobación de costos enviada por WhatsApp. El servicio pasará a reparación cuando sea aprobado.',
            default => 'Costos aprobados verbalmente. El servicio pasó a reparación.',
        };

        return response()->json([
            'success' => true,
            'message' => $message,
            'whatsapp_url' => $whatsapp_url,
        ]);
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
