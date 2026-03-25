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
    protected $total;
    public function __construct($service, $total)
    {
        $this->service = $service;
        $this->total = $total;
    }

    /**
     * Execute the job.
     */
    public function handle(ReceiptServiService $receiptServiService): void
    {
        $receiptServiService->pdfServiceRepair($this->service, $this->total);
    }
}
