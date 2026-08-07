<?php

namespace App\Http\Controllers;

use App\Services\ServiceIssueService;
use Illuminate\Http\Request;

class ServiceIssueController extends Controller
{

    protected ServiceIssueService $serviceIssueService;

    public function __construct(ServiceIssueService $serviceIssueService)
    {
        $this->serviceIssueService = $serviceIssueService;
    }

    public function list($servi_id)
    {
        $issues = $this->serviceIssueService->listByService($servi_id);
        return response()->json([
            'code' => 200,
            'message' => 'Detalles de ingreso obtenidos correctamente.',
            'data' => $issues,
        ]);
    }

    public function store(Request $request)
    {
        $issue = $this->serviceIssueService->store($request->issue, $request->service_id);
        return response()->json([
            'code' => 200,
            'message' => 'Detalle de ingreso agregado correctamente.',
            'data' => $issue,
        ]);
    }
    public function delete($id)
    {
        $this->serviceIssueService->removeIssue($id);
        return response()->json([
            'code' => 200,
            'message' => 'Detalle de ingreso eliminado correctamente.',
            'success' => true,
        ]);
    }
}
