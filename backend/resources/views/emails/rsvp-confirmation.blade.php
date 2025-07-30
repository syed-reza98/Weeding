<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSVP Confirmation - Sarah & Ahmad Wedding</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #f43f5e, #ec4899);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #fff;
            padding: 30px;
            border: 1px solid #e5e5e5;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            border: 1px solid #e5e5e5;
            border-top: none;
        }
        .event-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
        }
        .status-confirmed {
            background: #d1fae5;
            color: #065f46;
        }
        .status-declined {
            background: #fee2e2;
            color: #991b1b;
        }
        .heart {
            color: #f43f5e;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💕 Sarah & Ahmad</h1>
        <h2>RSVP Confirmation</h2>
    </div>

    <div class="content">
        <p>Dear {{ $user->name }},</p>

        <p>Thank you for your RSVP! We're <strong>{{ $rsvp->status === 'confirmed' ? 'thrilled' : 'sorry' }}</strong> 
        {{ $rsvp->status === 'confirmed' ? 'that you can join us' : 'that you can\'t make it' }} for our special day.</p>

        <div class="event-details">
            <h3>{{ $event->name }}</h3>
            <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($event->event_date)->format('F j, Y') }}</p>
            <p><strong>Time:</strong> {{ \Carbon\Carbon::parse($event->event_date)->format('g:i A') }}</p>
            <p><strong>Venue:</strong> {{ $event->venue_name }}</p>
            <p><strong>Address:</strong> {{ $event->venue_address }}</p>
            @if($event->dress_code)
            <p><strong>Dress Code:</strong> {{ $event->dress_code }}</p>
            @endif
        </div>

        <p><strong>Your RSVP Status:</strong> 
        <span class="status-badge {{ $rsvp->status === 'confirmed' ? 'status-confirmed' : 'status-declined' }}">
            {{ $rsvp->status === 'confirmed' ? 'Confirmed' : 'Declined' }}
        </span></p>

        @if($rsvp->status === 'confirmed')
            <p><strong>Number of Guests:</strong> {{ $rsvp->guest_count }}</p>
            
            @if($rsvp->dietary_restrictions)
            <p><strong>Dietary Restrictions:</strong> {{ $rsvp->dietary_restrictions }}</p>
            @endif
            
            @if($rsvp->special_requests)
            <p><strong>Special Requests:</strong> {{ $rsvp->special_requests }}</p>
            @endif

            <p>We can't wait to celebrate with you! If you need to make any changes to your RSVP, 
            please visit our wedding website or contact us directly.</p>
        @else
            <p>We understand that you can't make it, but you'll be in our thoughts on our special day. 
            We hope to celebrate with you soon!</p>
        @endif

        <p>With love and excitement,<br>
        <strong class="heart">Sarah & Ahmad ❤️</strong></p>
    </div>

    <div class="footer">
        <p><strong>Wedding Website:</strong> <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}">Visit Our Wedding Site</a></p>
        <p><strong>Questions?</strong> Contact us at <a href="mailto:contact@sarahahmad-wedding.com">contact@sarahahmad-wedding.com</a></p>
        <p style="font-size: 12px; color: #666;">
            This is an automated confirmation email. Please do not reply to this email.
        </p>
    </div>
</body>
</html>