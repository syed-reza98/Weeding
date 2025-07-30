<?php

namespace App\Mail;

use App\Models\RSVP;
use App\Models\User;
use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RSVPConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $rsvp;
    public $user;
    public $event;

    /**
     * Create a new message instance.
     */
    public function __construct(RSVP $rsvp, User $user, Event $event)
    {
        $this->rsvp = $rsvp;
        $this->user = $user;
        $this->event = $event;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'RSVP Confirmation - Sarah & Ahmad Wedding',
            from: 'no-reply@sarahahmad-wedding.com',
            replyTo: 'contact@sarahahmad-wedding.com',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.rsvp-confirmation',
            with: [
                'rsvp' => $this->rsvp,
                'user' => $this->user,
                'event' => $this->event,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
