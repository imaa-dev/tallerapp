<?php

namespace App\Services;

use App\DAO\SparePartsDAO;
use App\DTO\CreateDiagnosisDTO;
use App\DTO\ServiceResult;
use App\Jobs\ProcessReceipt;
use Illuminate\Support\Facades\Log;
use App\Models\Diagnosis;


class DiagnosisService
{
    private ReasonService $reasonService;
    private ServiService $serviService;

    public function __construct(
        ReasonService $reasonService,
        ServiService $serviService)
    {
        $this->reasonService = $reasonService;
        $this->serviService = $serviService;
    }

    public function create(CreateDiagnosisDTO $dto, array $reasons_diagnosis, bool $notificate, bool $notificate_technician, $user_logued, int $organization_id){
        $diagnosis = Diagnosis::create([
            'servi_id' => $dto->servi_id,
            'diagnosis' => $dto->diagnosis,
            'repair_time' => $dto->repair_time,
            'cost' => $dto->cost
        ]);
        $service = $this->serviService->getServiceWithProductClientFileReasonDiagnosis($dto->servi_id);
        $this->reasonService->addDiagnosisReasons($reasons_diagnosis, $diagnosis->id);
        $this->serviService->updateStatusService($dto->servi_id, 3);
        ProcessReceipt::dispatch($service, $notificate, $notificate_technician, $user_logued, $organization_id);
        return $diagnosis;
    }

    public function delete(int $id): void
    {
        Diagnosis::destroy($id);
    }
}
