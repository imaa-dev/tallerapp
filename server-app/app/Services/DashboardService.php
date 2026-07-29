<?php

namespace App\Services;

use App\Models\Servi;
use App\Models\User;
use App\Models\Product;
use App\Models\SpareParts;
use Carbon\Carbon;

class DashboardService
{
    public function getDashboardData(int $organizationId): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        // Service counts by status
        $serviceCounts = Servi::query()
            ->where('organization_id', $organizationId)
            ->selectRaw('status_id, COUNT(*) as total')
            ->groupBy('status_id')
            ->pluck('total', 'status_id');

        $serviceStatus = [
            [
                'slug' => 'recepcionados',
                'label' => 'Recepción',
                'count' => $serviceCounts[1] ?? 0,
                'color' => '#3B82F6',
            ],
            [
                'slug' => 'diagnosticados',
                'label' => 'Diagnóstico',
                'count' => $serviceCounts[2] ?? 0,
                'color' => '#8B5CF6',
            ],
            [
                'slug' => 'repuestos',
                'label' => 'Repuestos',
                'count' => $serviceCounts[3] ?? 0,
                'color' => '#F97316',
            ],
            [
                'slug' => 'en-reparacion',
                'label' => 'En reparación',
                'count' => $serviceCounts[4] ?? 0,
                'color' => '#6B7280',
            ],
            [
                'slug' => 'reparados',
                'label' => 'Reparados',
                'count' => $serviceCounts[5] ?? 0,
                'color' => '#22C55E',
            ],
            [
                'slug' => 'entregados',
                'label' => 'Entregados',
                'count' => $serviceCounts[6] ?? 0,
                'color' => '#10B981',
            ],
        ];

        $totalServices = array_sum(array_column($serviceStatus, 'count'));

        $activeServices = collect($serviceStatus)
            ->where('slug', '!=', 'entregados')
            ->sum('count');

        // Products
        $totalProducts = Product::where('organization_id', $organizationId)->count();

        // Clients
        $totalClients = User::where('created_by_organization_id', $organizationId)
            ->where('rol', 'CLIENT')
            ->count();

        $newClientsThisMonth = User::where('created_by_organization_id', $organizationId)
            ->where('rol', 'CLIENT')
            ->where('created_at', '>=', $startOfMonth)
            ->count();

        // Recurring clients
        $recurringClients = User::query()
            ->where('created_by_organization_id', $organizationId)
            ->where('rol', 'CLIENT')
            ->whereHas('servis', function ($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            }, '>', 1)
            ->count();

        // Spare parts
        $totalSpareParts = SpareParts::whereHas('service', function ($q) use ($organizationId) {
            $q->where('organization_id', $organizationId);
        })->count();

        // Business metrics
        $servicesThisMonth = Servi::with('diagnosis')
            ->where('organization_id', $organizationId)
            ->where('date_entry', '>=', $startOfMonth)
            ->get();

        $revenueThisMonth = 0;

        foreach ($servicesThisMonth as $service) {
            $diagnosisSum = 0;

            if ($service->diagnosis) {
                foreach ($service->diagnosis as $diagnosis) {
                    $diagnosisSum += $diagnosis->cost ?? 0;
                }
            }

            $revenueThisMonth += ($service->repair_price ?? 0) + $diagnosisSum;
        }

        $avgTicket = $servicesThisMonth->count()
            ? round($revenueThisMonth / $servicesThisMonth->count(), 2)
            : 0;

        return [
            'services' => [
                'total' => $totalServices,
                'active' => $activeServices,
                'status' => $serviceStatus,
            ],

            'clients' => [
                'total' => $totalClients,
                'new_this_month' => $newClientsThisMonth,
                'recurring' => $recurringClients,
            ],

            'business' => [
                'revenue_this_month' => $revenueThisMonth,
                'avg_ticket' => $avgTicket,
            ],

            'counts' => [
                'products' => $totalProducts,
                'clients' => $totalClients,
                'services' => $totalServices,
                'services_reparaciones' => $serviceCounts[4] ?? 0,
                'others' => $totalSpareParts,
            ],
        ];
    }
}
