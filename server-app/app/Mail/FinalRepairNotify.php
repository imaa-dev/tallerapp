<?php

namespace App\Mail;

use App\Models\Servi;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FinalRepairNotify extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Servi $service,
        public string $link
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reparación finalizada',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.final_repair',
            with: [
                'service' => $this->service,
                'link' => $this->link,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
