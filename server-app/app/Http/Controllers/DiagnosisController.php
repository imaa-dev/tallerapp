<?php

namespace App\Http\Controllers;

use App\DTO\CreateDiagnosisDTO;
use App\Http\Requests\StoreDiagnosisRequest;
use App\Services\DiagnosisService;

class DiagnosisController extends Controller
{

    private DiagnosisService $diagnosisService;

    public function __construct(DiagnosisService $diagnosisService)
    {
        $this->diagnosisService = $diagnosisService;
    }

    public function create(StoreDiagnosisRequest $request){
        $selectedIssues = $request->selected_issues;
        $dto = new CreateDiagnosisDTO($request);
        $issues = $this->diagnosisService->create($dto, $selectedIssues);
        return response()->json([
            'success' => true,
            'message' => 'Diagnóstico creado correctamente.',
            'data' => $issues,
        ]);
    }

    public function delete($id){
        $this->diagnosisService->clearDiagnosis($id);
        return response()->json([
            'success' => true,
            'message' => 'Diagnostico eliminado',
        ]);
    }
}
