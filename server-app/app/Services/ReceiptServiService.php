<?php

namespace App\Services;

use App\Mail\DiagnosisPdfMail;
use App\Mail\RepairPdfMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Barryvdh\Snappy\Facades\SnappyPdf;

class ReceiptServiService
{
    public function pdfService($data, $notificate){

        Log::info('GENERATING RECEIPT PDF', [
            'receipt_id' => $data->id
        ]);

        $pdf = SnappyPdf::loadView('receipt.receipt', [
            'data' => $data
        ])->setOption('enable-local-file-access', true);

        $path = "receipts/{$data->id}/{$data->client->id}/receipt.pdf";
        $fullPath = Storage::disk('public')->path($path);
        Storage::disk('public')->makeDirectory(dirname($path));
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
        $pdf->save($fullPath);
        Log::error(storage_path('storage/'));
        if($notificate === true){
            Mail::to($data->client->email)->send( new DiagnosisPdfMail($data, $fullPath));
        }

        return $path;
    }

    public function pdfServiceRepair($data){
        Log::info('GENERATING RECEIPT PDF FINAL', [
            'receipt_id' => $data->id
        ]);

        $pdf = SnappyPdf::loadView('receipt.repair_receipt', [
            'data' => $data
        ])->setOption('enable-local-file-access', true);

        $path = "receipts/{$data->id}/{$data->client->id}/receipt.pdf";
        $fullPath = Storage::disk('public')->path($path);
        Storage::disk('public')->makeDirectory(dirname($path));
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
        $pdf->save($fullPath);
        Mail::to($data->client->email)->send( new RepairPdfMail($data, $fullPath));
        return $path;
    }
}
