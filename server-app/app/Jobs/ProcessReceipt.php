<?php

namespace App\Jobs;

use App\Services\ReceiptServiService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessReceipt implements ShouldQueue
{
    use Queueable;

    protected $data;
    protected $notificate;
    protected $notificate_technician;
    protected $user_logued;
    protected $organization_id;
    public function __construct($data, $notificate, $notificate_technician, $user_logued, $organization_id)
    {
        $this->data = $data;
        $this->notificate = $notificate;
        $this->notificate_technician = $notificate_technician;
        $this->user_logued = $user_logued;
        $this->organization_id = $organization_id;
    }

    /**
     * Execute the job.
     */
    public function handle(ReceiptServiService $receiptServiService): void
    {
        $receiptServiService->pdfService($this->data, $this->notificate, $this->notificate_technician, $this->user_logued, $this->organization_id);
    }
}
