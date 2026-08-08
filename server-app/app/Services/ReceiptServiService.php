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
}
