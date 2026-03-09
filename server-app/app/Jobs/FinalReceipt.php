<?php

namespace App\Jobs;

use App\Mail\RepairNotifyMail;
use App\Services\ReceiptServiService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class FinalReceipt implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */

    protected $service;
    public function __construct($service)
    {
        $this->service = $service;
    }

    /**
     * Execute the job.
     */
    public function handle(ReceiptServiService $receiptServiService): void
    {
        $receiptServiService->pdfServiceRepair($this->service);
    }
}
