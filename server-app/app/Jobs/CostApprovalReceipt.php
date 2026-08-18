<?php

namespace App\Jobs;

use App\Services\ReceiptServiService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CostApprovalReceipt implements ShouldQueue
{
    use Queueable;

    protected $service;
    protected $organization_id;

    public function __construct($service, $organization_id)
    {
        $this->service = $service;
        $this->organization_id = $organization_id;
    }

    public function handle(ReceiptServiService $receiptServiService): void
    {
        $receiptServiService->pdfCostApproval($this->service, $this->organization_id);
    }
}
