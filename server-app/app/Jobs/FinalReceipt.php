<?php

namespace App\Jobs;

use App\Mail\RepairNotifyMail;
use App\Services\ReceiptServiService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class FinalReceipt implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */

    protected $service;
    protected $total;
    protected $organization_id;

    public function __construct($service, $total, $organization_id)
    {
        $this->service = $service;
        $this->total = $total;
        $this->organization_id = $organization_id;
    }

    /**
     * Execute the job.
     */
    public function handle(ReceiptServiService $receiptServiService): void
    {
        $receiptServiService->pdfServiceRepair($this->service, $this->total, $this->organization_id);
    }
}
