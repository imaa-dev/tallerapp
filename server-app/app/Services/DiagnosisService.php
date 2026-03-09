<?php

namespace App\Services;

use App\DAO\DiagnosisDAO;
use App\DAO\SparePartsDAO;
use App\DTO\CreateDiagnosisDTO;
use App\DTO\ServiceResult;
use App\Jobs\ProcessReceipt;
use Illuminate\Support\Facades\Log;

class DiagnosisService
{
    private DiagnosisDAO $diagnosisDAO;
    private ReasonService $reasonService;
    private ServiService $serviService;

    public function __construct(
        DiagnosisDAO $diagnosisDAO,
        ReasonService $reasonService,
        ServiService $serviService)
    {
        $this->diagnosisDAO = $diagnosisDAO;
        $this->reasonService = $reasonService;
        $this->serviService = $serviService;
    }

    public function create(CreateDiagnosisDTO $dto, array $reasons_diagnosis, bool $notificate){
        try {
            $diagnosis = $this->diagnosisDAO->create([
                'servi_id' => $dto->servi_id,
                'diagnosis' => $dto->diagnosis,
                'repair_time' => $dto->repair_time,
                'cost' => $dto->cost
            ]);
            $service = $this->serviService->getServiceWithProductClientFileReasonDiagnosis($dto->servi_id);
            Log::error($service);
            $this->reasonService->addDiagnosisReasons($reasons_diagnosis, $diagnosis->id);
            $this->serviService->updateStatusService($dto->servi_id, 3);
            ProcessReceipt::dispatch($service, $notificate);

            return new ServiceResult(
                true,
                201,
                'Diagnostico del servicio creado satisfactoriamente',
                $diagnosis
            );
        } catch (\Throwable $th){
            Log::error($th->getMessage());
            return new ServiceResult(
                false,
                500,
                'ERROR'
            );
        }
    }

    public function delete(int $id){
        try {
            $this->diagnosisDAO->destroy($id);
            return new ServiceResult(
                true,
                200,
                'Diagnostico de servicio eliminado satisfactoriamente'
            );
        } catch (\Throwable $th){
            return new ServiceResult(
                false,
                500,
                'ERROR'
            );
        }
    }
}
