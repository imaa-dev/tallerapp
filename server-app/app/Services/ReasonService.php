<?php
namespace App\Services;


use App\DTO\ServiceResult;
use App\Models\Reason;
use Illuminate\Support\Facades\Log;

class ReasonService{

    public function storeReasons($reasons, $id): void
    {
        foreach ($reasons as $reasonInsert){
            Reason::create([
                'servi_id' => $id,
                'reason_note' => $reasonInsert['reason_note'],
            ]);
        }

    }

    public function store($reason, $id)
    {
        Reason::create([
            'servi_id' => $id,
            'reason_note' => $reason
        ]);
        return Reason::findOrFail($id);
    }
    public function removeReason(int $id): void
    {
        Reason::destroy($id);        
    }

    public function addDiagnosisReasons(array $reasons_diagnosis, int $diagnosis_id)
    {

        foreach ($reasons_diagnosis as $reason_diagnosis){
            $reason = Reason::findOrFail($reason_diagnosis['value']);
            $reason->update([
                'diagnosis_id' => $diagnosis_id,
                'attend' => true
            ]);
        }
    }
}
