<?php

namespace App\Jobs;

use App\Mail\StartRepairApproval;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendStartRepairApproval implements ShouldQueue
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
        Mail::to($this->service->client->email)->send(new StartRepairApproval($this->service, $this->link));
    }
}
