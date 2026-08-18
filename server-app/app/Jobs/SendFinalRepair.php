<?php

namespace App\Jobs;

use App\Mail\FinalRepairNotify;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendFinalRepair implements ShouldQueue
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
        Mail::to($this->service->client->email)->send(new FinalRepairNotify($this->service, $this->link));
    }
}
