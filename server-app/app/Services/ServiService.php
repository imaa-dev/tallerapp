<?php

namespace App\Services;

use App\Enums\ServiceStatus;
use App\Jobs\FinalReceipt;
use App\Jobs\InspectNotify;
use App\Jobs\RepairNotify;
use App\Models\Servi;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ServiService
{
    private ReasonService $reasonService;

    private ServiceFilesService $serviceFilesService;

    public function __construct(
        ReasonService $reasonService,
        ServiceFilesService $serviceFilesService
    ) {
        $this->reasonService = $reasonService;
        $this->serviceFilesService = $serviceFilesService;
    }

    public function create(array $data, ?array $files, int $user_id, ?array $reasonNotes)
    {
        $servi_paths = [];

        if ($files) {
            foreach ($files as $file) {
                $path = $file->store('servi/'.$user_id, 'public');
                $servi_paths[] = $path;
            }
        }
        $uuid = (string) Str::uuid();

        $servi = Servi::create([
            'uuid' => $uuid,
            'user_id' => $data['user_id'],
            'organization_id' => $data['organization_id'],
            'product_id' => $data['product_id'],
            'status_id' => $data['status_id'],
            'date_entry' => $data['date_entry'],
        ]);

        if ($reasonNotes) {
            $this->reasonService->storeReasons($reasonNotes, $servi->id);
        }

        if (! empty($servi_paths)) {
            foreach ($servi_paths as $path) {
                $servi->file()->create([
                    'path' => $path,
                ]);
            }
        }

        return $servi;
    }

    public function update(array $data)
    {
        $service = Servi::findOrFail($data['id']);
        $service->update([
            'user_id' => $data['user_id'],
            'product_id' => $data['product_id'],
            'date_entry' => $data['date_entry'],
        ]);

        return $service;
    }

    public function delete(int $id): void
    {
        $service = Servi::withCount('spareparts')->findOrFail($id);
        if (! $service) {
            throw new ModelNotFoundException('Servicio no encontrado');
        }
        if ($service->spareparts_count) {
            throw new HttpException(
                409,
                'Este servicio tiene repuestos asociados, debe quitar los repuestos asociados para eliminar'
            );
        }
        if ($service->file) {
            foreach ($service->file as $file) {
                Storage::disk('public')->delete($file->path);
                $file->delete();
            }
        }
        $service->delete();
    }

    public function getTypeService(int $organizationId, ServiceStatus $status)
    {
        return Servi::query()
            ->forOrganization($organizationId)
            ->forStatus($status->value)
            ->withFullRelations()
            ->orderByDesc('id')
            ->get();
    }

    public function goBack(int $id, ServiceStatus $status)
    {
        $previousStatus = $status->previous();

        if (! $previousStatus) {
            throw new \InvalidArgumentException('No existe un estado anterior al estado actual.');
        }

        $serviceToGoBack = Servi::findOrFail($id);
        $serviceToGoBack->status_id = $previousStatus->value;
        $serviceToGoBack->save();

        return $serviceToGoBack;
    }

    public function getServiceWithProductClientFileReasonDiagnosis(int $service_id)
    {
        return $this->findService($service_id);
    }

    private function findService(int $id): ?Servi
    {
        return Servi::query()
            ->withFullRelations()
            ->find($id);
    }

    public function updateStatusService(int $service_id, ServiceStatus $status)
    {
        $service = Servi::findOrFail($service_id);
        $service->update([
            'status_id' => $status->value,
        ]);
    }

    public function updateStatusServiceNotifyInspect(int $service_id, ServiceStatus $status, bool $notification_client): void
    {
        $serviceToRepaired = Servi::findOrFail($service_id);
        $serviceToRepaired->update([
            'status_id' => $status->value,
        ]);

        $service = $this->findService($service_id);
        if ($notification_client) {
            InspectNotify::dispatch($service);
        }

    }

    public function updateStatusServiceNotifyRepair(int $service_id, ServiceStatus $status, bool $notification_client)
    {
        $serviceToRepaired = Servi::findOrFail($service_id);
        $serviceToRepaired->update([
            'status_id' => $status->value,
        ]);
        $service = Servi::withFullRelations()
            ->findOrFail($service_id);
        if ($notification_client) {
            RepairNotify::dispatch($service);
        }
    }

    public function repairServiceNotifyClient(int $service_id, ServiceStatus $status, float $repair_price, string $final_note, int $organization_id)
    {
        $service = Servi::withFullRelations()->findOrFail($service_id);
        $service->update([
            'status_id' => $status->value,
            'repair_price' => $repair_price,
            'final_note' => $final_note,
        ]);
        $total = $service->diagnosis->sum('cost') + $repair_price;
        FinalReceipt::dispatch($service, $total, $organization_id);
    }

    public function getCountTypeService($id)
    {
        $raw = Servi::query()
            ->where('organization_id', $id)
            ->selectRaw('status_id, COUNT(*) as total')
            ->groupBy('status_id')
            ->pluck('total', 'status_id');

        return [
            'serviceRecepcionado' => $raw[ServiceStatus::Reception->value] ?? 0,
            'serviceDiagnosticado' => $raw[ServiceStatus::Diagnosis->value] ?? 0,
            'serviceAR' => $raw[ServiceStatus::SparePartApproval->value] ?? 0,
            'serviceER' => $raw[ServiceStatus::InRepair->value] ?? 0,
            'serviceReparado' => $raw[ServiceStatus::Repaired->value] ?? 0,
            'serviceEntregado' => $raw[ServiceStatus::Delivered->value] ?? 0,
            'serviceIncidencia' => $raw[ServiceStatus::Incident->value] ?? 0,
        ];
    }

    public function getCountTypeServiceR($organization_id)
    {
        $counts = Servi::query()
            ->where('organization_id', $organization_id)
            ->selectRaw('status_id, COUNT(*) as total')
            ->groupBy('status_id')
            ->pluck('total', 'status_id');

        return [
            [
                'slug' => 'recepcionados',
                'label' => 'Recepción',
                'count' => $counts[ServiceStatus::Reception->value] ?? 0,
                'color' => '#3B82F6',
            ],
            [
                'slug' => 'diagnosticados',
                'label' => 'Diagnóstico',
                'count' => $counts[ServiceStatus::Diagnosis->value] ?? 0,
                'color' => '#8B5CF6',
            ],
            [
                'slug' => 'repuestos',
                'label' => 'Repuestos',
                'count' => $counts[ServiceStatus::SparePartApproval->value] ?? 0,
                'color' => '#F97316',
            ],
            [
                'slug' => 'en-reparacion',
                'label' => 'En reparacion',
                'count' => $counts[ServiceStatus::InRepair->value] ?? 0,
                'color' => '#6B7280',
            ],
            [
                'slug' => 'reparados',
                'label' => 'Reparados',
                'count' => $counts[ServiceStatus::Repaired->value] ?? 0,
                'color' => '#22C55E',
            ],
            [
                'slug' => 'entregados',
                'label' => 'Entregados',
                'count' => $counts[ServiceStatus::Delivered->value] ?? 0,
                'color' => '#10B981',
            ],
        ];
    }
}
