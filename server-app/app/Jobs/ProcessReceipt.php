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
    public function __construct($data, $notificate)
    {
        $this->data = $data;
        $this->notificate = $notificate;
    }

    /**
     * Execute the job.
     */
    public function handle(ReceiptServiService $receiptServiService): void
    {
        $receiptServiService->pdfService($this->data, $this->notificate);
    }
}
