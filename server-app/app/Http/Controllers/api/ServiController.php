<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Enums\ServiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Models\Servi;
use App\Services\ServiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiController extends Controller
{
    use ApiResponse;

    protected ServiService $serviService;

    public function __construct(ServiService $serviService)
    {
        $this->serviService = $serviService;
    }

    public function listServices(Request $request)
    {
        $organization_id = $request->user()->currentAccessToken()->organization_id;
        $countTypeService = $this->serviService
            ->getCountTypeServiceR($organization_id);

        return $this->success(
            $countTypeService,
            'Servicios obtenidos',
            200
        );
    }

    public function getServices(Request $request)
    {
        $organization_id = $request->user()->currentAccessToken()->organization_id;

        $statusValue = $request->input('status');
        $status = $statusValue
            ? ServiceStatus::from((int) $statusValue)
            : ServiceStatus::Reception;

        $services = $this->serviService->getTypeService($organization_id, $status);

        return $this->success(
            $services,
            'Servicios obtenidos',
            200
        );
    }

    public function create(StoreServiceRequest $request)
    {
        Log::info('Creating service with data: ', $request->validated());
        $this->serviService->create($request->validated(), $request->file('file'), $request->user()->id, $request->issues);

        return $this->success(
            null,
            'Servicio creado correctamente',
            200
        );
    }

    public function advanceStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|integer|in:2,3,4,5,6,7',
        ]);

        $service = Servi::findOrFail($id);
        $service->update(['status_id' => $request->status]);

        return $this->success($service, 'Estado actualizado', 200);
    }

    public function updateDiagnosis(Request $request, int $id)
    {
        $request->validate([
            'issues' => 'required|array',
            'issues.*.issue' => 'required|string',
            'issues.*.cost' => 'required|numeric|min:0',
        ]);

        $service = Servi::findOrFail($id);
        $service->serviceIssues()->delete();
        foreach ($request->issues as $issue) {
            $service->serviceIssues()->create([
                'issue' => $issue['issue'],
                'cost' => $issue['cost'],
            ]);
        }
        $service->update(['status_id' => ServiceStatus::SparePartApproval->value]);

        return $this->success($service, 'Diagnostico guardado', 200);
    }

    public function approveSpareParts(Request $request, int $id)
    {
        $service = Servi::findOrFail($id);
        $service->update([
            'approve_spare_parts' => 1,
            'status_id' => ServiceStatus::CostApproval->value,
        ]);

        return $this->success($service, 'Repuestos aprobados', 200);
    }

    public function approveCost(Request $request, int $id)
    {
        $request->validate([
            'method' => 'required|string|in:verbal,email,whatsapp',
        ]);

        $this->serviService->sendCostApproval($id, $request->method);

        return $this->success(null, 'Costo aprobado', 200);
    }

    public function startRepair(Request $request, int $id)
    {
        $this->serviService->updateStatusService($id, ServiceStatus::InRepair);

        return $this->success(null, 'Reparacion iniciada', 200);
    }

    public function completeRepair(Request $request, int $id)
    {
        $request->validate([
            'repair_price' => 'required|numeric|min:0',
            'final_note' => 'required|string',
        ]);

        $this->serviService->repairServiceNotifyClient(
            $id,
            $request->repair_price,
            $request->final_note
        );

        $this->serviService->sendFinalRepair($id, 'verbal');

        return $this->success(null, 'Reparacion completada', 200);
    }

    public function deliver(Request $request, int $id)
    {
        $this->serviService->updateStatusService($id, ServiceStatus::Delivered);

        $service = Servi::findOrFail($id);
        $service->update(['date_exit' => now()]);

        return $this->success(null, 'Servicio entregado', 200);
    }

    public function detail(Request $request, int $id)
    {
        $service = $this->serviService->getServiceWithProductClientFileServiceIssues($id);

        return $this->success($service, 'Servicio obtenido', 200);
    }
}
