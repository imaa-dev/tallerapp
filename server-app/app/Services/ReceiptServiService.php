<?php

namespace App\Services;

use App\Mail\RepairPdfMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Barryvdh\Snappy\Facades\SnappyPdf;
use App\Models\RepairDocument;

class ReceiptServiService
{
    public function pdfServiceRepair($data, $total, $organization_id){
        Log::info('GENERATING RECEIPT FINAL PDF', [
            'data' => $data,
            'total' => $total
        ]);
        $pdf = SnappyPdf::loadView('receipt.repair_receipt', [
            'data' => $data,
            'total' => $total
        ])->setOption('enable-local-file-access', true);

        $path = "receipts/{$data->id}/{$data->client->id}/receipt{$data->id}.pdf";
        $fullPath = Storage::disk('public')->path($path);
        Storage::disk('public')->makeDirectory(dirname($path));
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
        $pdf->save($fullPath);
        RepairDocument::updateOrCreate(
            [
                'service_id' => $data->id,
                'type' => 'final',
            ],
            [
                'organization_id' => $organization_id,
                'filename' => "receipt{$data->id}.pdf",
                'path' => $path,
            ]
        );
        Mail::to($data->client->email)->send( new RepairPdfMail($data, $fullPath));
        return $path;
    }

    public function pdfCostApproval($service, $organization_id)
    {
        Log::info('GENERATING COST APPROVAL PDF', [
            'service_id' => $service->id,
        ]);

        $issues = $service->serviceIssues;
        $spare_parts = $service->spareparts;
        $total = $issues->sum('cost') + $spare_parts->sum('price');

        $pdf = SnappyPdf::loadView('diagnosis.cost_approval_pdf', [
            'servi' => $service,
            'issues' => $issues,
            'spare_parts' => $spare_parts,
            'total' => $total,
        ])->setOption('enable-local-file-access', true);

        $path = "receipts/{$service->id}/{$service->client->id}/cost_approval_{$service->id}.pdf";
        $fullPath = Storage::disk('public')->path($path);
        Storage::disk('public')->makeDirectory(dirname($path));

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }

        $pdf->save($fullPath);

        RepairDocument::updateOrCreate(
            [
                'service_id' => $service->id,
                'type' => 'cost_approval',
            ],
            [
                'organization_id' => $organization_id,
                'filename' => "cost_approval_{$service->id}.pdf",
                'path' => $path,
            ]
        );

        return $path;
    }
}
