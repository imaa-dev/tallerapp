<?php

namespace App\Http\Controllers;

use App\Enums\ServiceAccessStatus;
use App\Enums\ServiceStatus;
use App\Models\ServiceAccessToken;
use App\Models\Servi;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Illuminate\Support\Carbon;

class ServiceAccessController extends Controller
{
    // ---------- Cost approval public link ----------

    public function showCostApproval(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::CostApproval);

        if (! $access->client_accessed) {
            $access->update(['client_accessed' => true]);
        }

        $servi = $this->loadServi($access->servi_id);

        return \Inertia\Inertia::render('diagnosis/CostApproval', [
            'servi' => $this->serviProps($servi),
            'issues' => $servi->serviceIssues->map(fn ($issue) => [
                'id' => $issue->id,
                'issue' => $issue->issue,
                'diagnosis' => $issue->diagnosis,
                'repair_time' => $issue->repair_time,
                'cost' => $issue->cost,
                'attend' => $issue->attend,
            ])->values(),
            'spare_parts' => $servi->spareparts->map(fn ($part) => [
                'id' => $part->id,
                'brand' => $part->brand,
                'model' => $part->model,
                'price' => $part->price,
                'note' => $part->note,
            ])->values(),
            'total' => $this->calculateTotal($servi),
            'pdf_url' => route('service.access.cost.pdf', $token),
            'approve_url' => route('service.access.cost.approve', $token),
            'reject_url' => route('service.access.cost.reject', $token),
        ]);
    }

    public function approveCostApproval(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::CostApproval);

        $access->servi()->update([
            'status_id' => ServiceStatus::InRepair->value,
            'approve_spare_parts' => true,
        ]);

        return view('client.cost_approved');
    }

    public function rejectCostApproval(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::CostApproval);

        $access->servi()->update([
            'status_id' => ServiceStatus::SparePartApproval->value,
            'approve_spare_parts' => false,
        ]);

        return view('client.cost_rejected');
    }

    public function downloadCostApprovalPdf(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::CostApproval);

        if (! $access->pdf_downloaded) {
            $access->update(['pdf_downloaded' => true]);
        }

        $servi = $this->loadServi($access->servi_id);

        $pdf = SnappyPdf::loadView('diagnosis.cost_approval_pdf', [
            'servi' => $servi,
            'issues' => $servi->serviceIssues,
            'spare_parts' => $servi->spareparts,
            'total' => $this->calculateTotal($servi),
        ])->setOption('enable-local-file-access', true);

        return $pdf->download('aprobacion-costos-'.$servi->id.'.pdf');
    }

    // ---------- Start of repair public link ----------

    public function showStartRepair(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::RepairStart);

        if (! $access->client_accessed) {
            $access->update(['client_accessed' => true]);
        }

        $servi = $this->loadServi($access->servi_id);

        return \Inertia\Inertia::render('diagnosis/StartRepair', [
            'servi' => $this->serviProps($servi),
            'approve_url' => route('service.access.start.approve', $token),
        ]);
    }

    public function approveStartRepair(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::RepairStart);

        $access->servi()->update([
            'status_id' => ServiceStatus::Diagnosis->value,
        ]);

        return view('client.start_approved');
    }

    // ---------- Final repair public link ----------

    public function showFinalRepair(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::FinalRepair);

        if (! $access->client_accessed) {
            $access->update(['client_accessed' => true]);
        }

        $servi = $this->loadServi($access->servi_id);

        return \Inertia\Inertia::render('diagnosis/FinalRepair', [
            'servi' => $this->serviProps($servi),
            'issues' => $servi->serviceIssues->map(fn ($issue) => [
                'id' => $issue->id,
                'issue' => $issue->issue,
                'diagnosis' => $issue->diagnosis,
                'cost' => $issue->cost,
                'attend' => $issue->attend,
            ])->values(),
            'spare_parts' => $servi->spareparts->map(fn ($part) => [
                'id' => $part->id,
                'brand' => $part->brand,
                'model' => $part->model,
                'price' => $part->price,
                'note' => $part->note,
            ])->values(),
            'final_note' => $servi->final_note,
            'repair_price' => $servi->repair_price,
            'total' => $this->calculateTotal($servi),
            'pdf_url' => route('service.access.final.pdf', $token),
        ]);
    }

    public function downloadFinalRepairPdf(string $token)
    {
        $access = $this->findByToken($token, ServiceAccessStatus::FinalRepair);

        if (! $access->pdf_downloaded) {
            $access->update(['pdf_downloaded' => true]);
        }

        $servi = $this->loadServi($access->servi_id);

        $pdf = SnappyPdf::loadView('receipt.repair_receipt', [
            'data' => $servi,
            'total' => $this->calculateTotal($servi),
        ])->setOption('enable-local-file-access', true);

        return $pdf->download('reparacion-final-'.$servi->id.'.pdf');
    }

    // ---------- Helpers ----------

    private function findByToken(string $token, ServiceAccessStatus $status): ServiceAccessToken
    {
        $access = ServiceAccessToken::where('token', $token)
            ->where('status', $status->value)
            ->first();

        if (! $access) {
            abort(404, 'Enlace no encontrado');
        }

        return $access;
    }

    private function loadServi(int $serviId): Servi
    {
        return Servi::with(['client', 'product', 'organization', 'file', 'serviceIssues', 'spareparts'])
            ->findOrFail($serviId);
    }

    private function serviProps(Servi $servi): array
    {
        return [
            'client_name' => $servi->client?->name,
            'organization_name' => $servi->organization?->name,
            'organization_description' => $servi->organization?->description,
            'product_name' => $servi->product?->name,
            'product_brand' => $servi->product?->brand,
            'product_model' => $servi->product?->model,
            'date_entry' => $servi->date_entry
                ? Carbon::parse($servi->date_entry)->format('d/m/Y')
                : null,
            'files' => ($servi->file ?? collect())->map(fn ($file) => $file->path)->values(),
        ];
    }

    private function calculateTotal(Servi $servi): float
    {
        $diagnosisCost = $servi->serviceIssues->sum('cost');
        $sparePartsCost = $servi->spareparts->sum('price');
        $repairPrice = $servi->repair_price ?? 0;

        return (float) ($diagnosisCost + $sparePartsCost + $repairPrice);
    }
}
