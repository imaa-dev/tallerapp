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
        $reasonsDiagnosis = $request->selected_resons;
        $notificate_client = $request->notificate_client;
        $notificate_admin = $request->notificate_admin;
        $dto = new CreateDiagnosisDTO($request);
        $res = $this->diagnosisService->create($dto, $reasonsDiagnosis, $notificate_client);
        return response()->json($res);
    }

    public function delete($id){
        $res = $this->diagnosisService->delete($id);
        return response()->json($res);
    }
}
