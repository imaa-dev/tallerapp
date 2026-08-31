<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardApiController extends Controller
{
    use ApiResponse;

    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function stats(Request $request)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;
        $data = $this->dashboardService->getDashboardData($organizationId);

        return $this->success($data, 'Dashboard obtenido correctamente', 200);
    }
}
