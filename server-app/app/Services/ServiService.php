<?php

namespace App\Services;

use App\Enums\ServiceAccessStatus;
use App\Enums\ServiceStatus;
use App\Jobs\FinalReceipt;
use App\Jobs\CostApprovalReceipt;
use App\Jobs\SendCostApproval;
use App\Jobs\SendFinalRepair;
use App\Jobs\SendStartRepairApproval;
use App\Models\ServiceAccessToken;
use App\Models\Servi;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ServiService
{
    private ServiceIssueService $serviceIssueService;

    private ServiceFilesService $serviceFilesService;

    public function __construct(
        ServiceIssueService $serviceIssueService,
        ServiceFilesService $serviceFilesService
    ) {
        $this->serviceIssueService = $serviceIssueService;
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
            $this->serviceIssueService->storeIssues($reasonNotes, $servi->id);
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

    public function getServiceWithProductClientFileServiceIssues(int $service_id)
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

    public function repairServiceNotifyClient(int $service_id, float $repair_price, string $final_note)
    {
        $service = Servi::findOrFail($service_id);
        $service->update([
            'repair_price' => $repair_price,
            'final_note' => $final_note,
        ]);
    }

    public function sendFinalRepair(int $service_id, string $method): ?string
    {
        $service = Servi::withFullRelations()->findOrFail($service_id);
        $total = $service->serviceIssues->sum('cost') + $service->repair_price;

        $service->update(['status_id' => ServiceStatus::Repaired->value]);
        $this->ensureServiceAccessToken($service_id, ServiceAccessStatus::FinalRepair);

        if ($method === 'verbal') {
            return null;
        }

        if ($method === 'email') {
            $organization_id = session('tenant_id');
            FinalReceipt::dispatch($service, $total, $organization_id);

            $link = rtrim((string) config('app.public_url'), '/').'/final/'.$service->serviceAccessTokens->where('status', ServiceAccessStatus::FinalRepair->value)->first()?->token;
            SendFinalRepair::dispatch($service, $link);

            return null;
        }

        return $this->buildWhatsappUrl($service_id, ServiceAccessStatus::FinalRepair);
    }

    public function toCostApproval(int $service_id): void
    {
        $this->updateStatusService($service_id, ServiceStatus::CostApproval);
    }

    public function sendCostApproval(int $service_id, string $method): ?string
    {
        $organization_id = session('tenant_id');

        if ($method === 'verbal') {
            $this->updateStatusService($service_id, ServiceStatus::InRepair);

            $service = Servi::with(['client', 'product', 'organization', 'serviceIssues', 'spareparts'])->findOrFail($service_id);
            CostApprovalReceipt::dispatch($service, $organization_id);

            return null;
        }

        $access = $this->ensureServiceAccessToken($service_id, ServiceAccessStatus::CostApproval);

        if ($method === 'email') {
            $service = Servi::with(['client', 'product', 'organization', 'serviceIssues', 'spareparts'])->findOrFail($service_id);
            $link = rtrim((string) config('app.public_url'), '/').'/diagnosis/'.$access->token;
            SendCostApproval::dispatch($service, $link);
            CostApprovalReceipt::dispatch($service, $organization_id);

            return null;
        }

        $service = Servi::with(['client', 'product', 'organization', 'serviceIssues', 'spareparts'])->findOrFail($service_id);
        CostApprovalReceipt::dispatch($service, $organization_id);

        return $this->buildWhatsappUrl($service_id, ServiceAccessStatus::CostApproval);
    }

    public function sendStartRepairApproval(int $service_id, string $method): ?string
    {
        if ($method === 'verbal') {
            $this->updateStatusService($service_id, ServiceStatus::Diagnosis);

            return null;
        }

        $access = $this->ensureServiceAccessToken($service_id, ServiceAccessStatus::RepairStart);

        if ($method === 'email') {
            $service = Servi::with(['client', 'product', 'organization'])->findOrFail($service_id);
            $link = rtrim((string) config('app.public_url'), '/').'/start/'.$access->token;
            SendStartRepairApproval::dispatch($service, $link);

            return null;
        }

        return $this->buildWhatsappUrl($service_id, ServiceAccessStatus::RepairStart);
    }

    public function approveStartRepair(int $service_id): void
    {
        $this->updateStatusService($service_id, ServiceStatus::Diagnosis);
    }

    public function ensureServiceAccessToken(int $service_id, ServiceAccessStatus $status): ServiceAccessToken
    {
        $access = ServiceAccessToken::where('servi_id', $service_id)
            ->where('status', $status->value)
            ->first();

        if ($access) {
            return $access;
        }

        return ServiceAccessToken::create([
            'servi_id' => $service_id,
            'status' => $status->value,
            'token' => Str::random(32),
        ]);
    }

    public function buildWhatsappUrl(int $service_id, ServiceAccessStatus $status): ?string
    {
        $service = Servi::with(['client', 'product', 'organization'])->findOrFail($service_id);

        if (! $service->client?->phone) {
            return null;
        }

        $access = $this->ensureServiceAccessToken($service_id, $status);
        $link = rtrim((string) config('app.public_url'), '/');

        if ($status === ServiceAccessStatus::RepairStart) {
            $link .= '/start/'.$access->token;
            $message = sprintf(
                'Hola %s, tu %s ingresó a %s. Para comenzar la reparación necesitamos tu aprobación. Confirma aquí:',
                $service->client->name,
                $service->product?->name ?? 'servicio',
                $service->organization?->name ?? 'el taller'
            );
        } elseif ($status === ServiceAccessStatus::CostApproval) {
            $link .= '/diagnosis/'.$access->token;
            $message = sprintf(
                'Hola %s, te compartimos el detalle y los costos del diagnóstico de tu %s en %s. Revisa y aprueba aquí:',
                $service->client->name,
                $service->product?->name ?? 'servicio',
                $service->organization?->name ?? 'el taller'
            );
        } else {
            $link .= '/final/'.$access->token;
            $message = sprintf(
                'Hola %s, tu %s está reparado en %s. Revisa el detalle aquí:',
                $service->client->name,
                $service->product?->name ?? 'servicio',
                $service->organization?->name ?? 'el taller'
            );
        }

        $phone = preg_replace('/\D+/', '', $service->client->phone);

        return 'https://api.whatsapp.com/send/?phone='.$phone.'&text='.rawurlencode($message."\n".$link);
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
            'serviceCostApproval' => $raw[ServiceStatus::CostApproval->value] ?? 0,
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
                'slug' => 'aprobacion-costos',
                'label' => 'Aprobación de costos',
                'count' => $counts[ServiceStatus::CostApproval->value] ?? 0,
                'color' => '#14B8A6',
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
