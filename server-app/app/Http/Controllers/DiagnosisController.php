<?php

namespace App\Http\Controllers;

use App\DTO\CreateDiagnosisDTO;
use App\Http\Requests\StoreDiagnosisRequest;
use App\Services\DiagnosisService;
use Illuminate\Support\Facades\Log;

class DiagnosisController extends Controller
{

    private DiagnosisService $diagnosisService;

    public function __construct(DiagnosisService $diagnosisService)
    {
        $this->diagnosisService = $diagnosisService;
    }

    public function create(StoreDiagnosisRequest $request){
        $reasonsDiagnosis = $request->selected_resons;
        $notificate_client = $request->notificate_client;
        $notificate_technician = $request->notificate_technician;
        $user_logued = auth()->user();
        $dto = new CreateDiagnosisDTO($request);
        $organization_id = session('tenant_id');
        $diagnosis = $this->diagnosisService->create($dto, $reasonsDiagnosis, $notificate_client, $notificate_technician, $user_logued, $organization_id);
        return response()->json([
            'success' => true,
            'message' => 'Diagnóstico creado correctamente.',
            'data' => $diagnosis,
        ]);
    }

    public function delete($id){
        $this->diagnosisService->delete($id);
        return response()->json([
            'success' => true,
            'message' => 'Diagnostico eliminado',
        ]);
    }
}
