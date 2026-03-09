<?php

namespace App\Jobs;

use App\Mail\InspectNotifyMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class InspectNotify implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected $service;
    public function __construct(
        $service
    )
    {
        $this->service = $service;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->service->client->email)->send(new InspectNotifyMail($this->service));
    }
}
