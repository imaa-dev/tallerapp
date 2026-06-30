<?php

namespace App\Jobs;

use App\Services\ReceiptServiService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessReceipt implements ShouldQueue
{
    use Queueable;

    protected $data;
    protected $notificate;
    protected $notificate_technician;
    protected $user_logued;
    public function __construct($data, $notificate, $notificate_technician, $user_logued)
    {
        $this->data = $data;
        $this->notificate = $notificate;
        $this->notificate_technician = $notificate_technician;
        $this->user_logued = $user_logued;
    }

    /**
     * Execute the job.
     */
    public function handle(ReceiptServiService $receiptServiService): void
    {
        $receiptServiService->pdfService($this->data, $this->notificate, $this->notificate_technician, $this->user_logued);
    }
}
