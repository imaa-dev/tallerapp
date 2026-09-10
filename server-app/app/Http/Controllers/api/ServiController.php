<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Enums\ServiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Models\ServiceIssue;
use App\Models\Servi;
use App\Services\ServiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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

    public function toDiagnosis(Request $request, int $id)
    {
        $request->validate([
            'method' => 'required|string|in:verbal,email,whatsapp',
        ]);

        $whatsapp_url = $this->serviService->sendStartRepairApproval($id, $request->method);

        $message = match ($request->method) {
            'email' => 'Solicitud de aprobación enviada al correo del cliente. El servicio pasará a diagnóstico cuando sea aprobado.',
            'whatsapp' => 'Enlace de aprobación enviado por WhatsApp. El servicio pasará a diagnóstico cuando sea aprobado.',
            default => 'Servicio aprobado verbalmente y enviado a diagnóstico.',
        };

        return $this->success(['whatsapp_url' => $whatsapp_url], $message, 200);
    }

    public function goBack(Request $request, int $id)
    {
        $request->validate([
            'status_id' => 'required|integer|in:2,3,4,5,6,7,8',
        ]);

        $currentStatus = ServiceStatus::tryFrom((int) $request->status_id);

        if (! $currentStatus || ! $currentStatus->previous()) {
            return response()->json([
                'status' => 'fail',
                'message' => 'No existe un estado anterior al estado actual.',
            ], 422);
        }

        $this->serviService->goBack($id, $currentStatus);

        return $this->success(null, 'Servicio regresado al estado anterior', 200);
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

    public function addDiagnosis(Request $request, int $id)
    {
        $request->validate([
            'issue_id' => 'required|integer',
            'diagnosis' => 'required|string',
            'repair_time' => 'required|string',
            'cost' => 'required|numeric|min:0',
        ]);

        $issue = ServiceIssue::where('id', $request->issue_id)
            ->where('servi_id', $id)
            ->firstOrFail();

        $issue->update([
            'diagnosis' => $request->diagnosis,
            'repair_time' => $request->repair_time,
            'cost' => $request->cost,
            'attend' => true,
        ]);

        return $this->success($issue, 'Diagnostico guardado', 200);
    }

    public function toSpareParts(Request $request, int $id)
    {
        $this->serviService->updateStatusService($id, ServiceStatus::SparePartApproval);

        return $this->success(null, 'Servicio pasado a repuestos', 200);
    }

    public function toCostApproval(Request $request, int $id)
    {
        $this->serviService->toCostApproval($id);

        return $this->success(null, 'Servicio enviado a aprobación de costos', 200);
    }

    public function uploadImages(Request $request, int $id)
    {
        $request->validate([
            'file' => 'required|array',
            'file.*' => 'file|max:5120',
        ]);

        $service = Servi::findOrFail($id);

        foreach ($request->file('file') as $file) {
            $path = $file->store('servi/'.$request->user()->id, 'public');
            $service->file()->create([
                'path' => $path,
            ]);
        }

        $files = $service->file()->get(['id', 'path'])->toArray();

        return $this->success($files, 'Imagen subida satisfactoriamente', 200);
    }

    public function deleteImage(Request $request, int $id, int $fileId)
    {
        $service = Servi::findOrFail($id);

        $file = $service->file()->where('id', $fileId)->firstOrFail();

        Storage::disk('public')->delete($file->path);
        $file->delete();

        return $this->success(null, 'Imagen eliminada satisfactoriamente', 200);
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

    public function assignSpareParts(Request $request, int $id)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $service = Servi::query()
            ->forOrganization($organizationId)
            ->findOrFail($id);

        $request->validate([
            'spare_parts' => 'required|array',
            'spare_parts.*' => [
                'required',
                'integer',
                Rule::exists('spare_parts', 'id')
                    ->where('organization_id', $organizationId)
                    ->whereNull('servi_id'),
            ],
        ]);

        $this->serviService->assignSpareParts($id, $request->spare_parts);

        return $this->success(null, 'Repuestos agregados al servicio', 200);
    }

    public function removeSparePart(Request $request, int $id)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $service = Servi::query()
            ->forOrganization($organizationId)
            ->findOrFail($id);

        $request->validate([
            'spare_part_id' => 'required|integer',
        ]);

        $this->serviService->removeSparePartFromService($id, $request->spare_part_id);

        return $this->success(null, 'Repuesto quitado del servicio', 200);
    }

    public function detail(Request $request, int $id)
    {
        $service = $this->serviService->getServiceWithProductClientFileServiceIssues($id);

        return $this->success($service, 'Servicio obtenido', 200);
    }
}
