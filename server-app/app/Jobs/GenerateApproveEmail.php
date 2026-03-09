<?php

namespace App\Jobs;

use App\Mail\ApproveSparePart;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class GenerateApproveEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected $service;
    protected $urls;
    public function __construct(
        $service,
        $urls
    )
    {
        $this->service = $service;
        $this->urls = $urls;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->service->client->email)->send(new ApproveSparePart($this->service, $this->urls));
    }
}
