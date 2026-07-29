<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use App\Services\ServiService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private ServiService $serviService;
    private UserService $userService;
    private DashboardService $dashboardService;

    public function __construct(ServiService $serviService, UserService $userService, DashboardService $dashboardService)
    {
        $this->serviService = $serviService;
        $this->userService = $userService;
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $organizationId = session('tenant_id');

        if (!$organizationId) {
            return Inertia::render('dashboard', [
                'hasOrganization' => false,
            ]);
        }

        $data = $this->dashboardService->getDashboardData($organizationId);

        return Inertia::render('dashboard', array_merge(['hasOrganization' => true], $data));
    }
}
