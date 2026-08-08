<?php

namespace App\Jobs;

use App\Mail\CostApprovalNotify;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendCostApproval implements ShouldQueue
{
    use Queueable;

    protected $service;

    protected $link;

    public function __construct($service, $link)
    {
        $this->service = $service;
        $this->link = $link;
    }

    public function handle(): void
    {
        Mail::to($this->service->client->email)->send(new CostApprovalNotify($this->service, $this->link));
    }
}
