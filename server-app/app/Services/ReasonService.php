<?php
namespace App\Services;


use App\DAO\ReasonServiceDAO;
use App\DTO\ServiceResult;
use App\Models\Reason;
use Illuminate\Support\Facades\Log;

class ReasonService{

    private ReasonServiceDAO $reasonServiceDAO;

    public function __construct(ReasonServiceDAO $reasonServiceDAO)
    {
        $this->reasonServiceDAO = $reasonServiceDAO;
    }

    public function storeReasons($reasons, $id): void
    {
        try {
            foreach ($reasons as $reasonInsert){
                $this->reasonServiceDAO->create([
                    'servi_id' => $id,
                    'reason_note' => $reasonInsert['reason_note']
                ]);
            }
        } catch(\Throwable $th){
            Log::error($th->getMessage());
        }

    }

    public function store($reason, $id): ServiceResult
    {
        try {
            $this->reasonServiceDAO->create([
                'servi_id' => $id,
                'reason_note' => $reason
            ]);
            $reasonServi = $this->reasonServiceDAO->getByServiceId($id);
            return new ServiceResult(
                true,
                200,
                'Detalle de ingreso agregado satisfactoriamente',
                $reasonServi
            );

        } catch (\Throwable $th){
            Log::error($th->getMessage());
            return new ServiceResult(
                false,
                500,
                'ERROR',
                []
            );

        }
    }
    public function removeReason(int $id): ServiceResult
    {
        try {
            $this->reasonServiceDAO->delete($id);
            return new ServiceResult(
                true,
                200,
                'Detalle de ingreso eliminado'
            );
        }catch (\Throwable $th){
            Log::error($th->getMessage());
            return new ServiceResult(
                false,
                500,
                'ERROR'
            );
        }
    }

    public function addDiagnosisReasons(array $reasons_diagnosis, int $diagnosis_id)
    {

        foreach ($reasons_diagnosis as $reason_diagnosis){
            $reason = $this->reasonServiceDAO->getById($reason_diagnosis['value']);
            $this->reasonServiceDAO->addDiagnosisReason($reason, $diagnosis_id);
        }
    }
}
