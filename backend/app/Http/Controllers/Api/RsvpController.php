<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rsvp;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class RsvpController extends Controller
{
    /**
     * Store a newly created RSVP.
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'guest_count' => 'required|integer|min:1|max:10',
            'dietary_restrictions' => 'nullable|string|max:1000',
            'special_requests' => 'nullable|string|max:1000',
            'status' => ['required', Rule::in(['confirmed', 'declined'])],
        ]);

        $user = Auth::user();
        $event = Event::findOrFail($request->event_id);

        // Check if RSVP already exists
        $existingRsvp = Rsvp::where('user_id', $user->id)
            ->where('event_id', $request->event_id)
            ->first();

        if ($existingRsvp) {
            // Update existing RSVP
            $existingRsvp->update([
                'guest_count' => $request->guest_count,
                'dietary_restrictions' => $request->dietary_restrictions,
                'special_requests' => $request->special_requests,
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'RSVP updated successfully',
                'data' => $existingRsvp,
            ]);
        }

        // Create new RSVP
        $rsvp = Rsvp::create([
            'user_id' => $user->id,
            'event_id' => $request->event_id,
            'guest_count' => $request->guest_count,
            'dietary_restrictions' => $request->dietary_restrictions,
            'special_requests' => $request->special_requests,
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'RSVP submitted successfully',
            'data' => $rsvp,
        ], 201);
    }

    /**
     * Display the RSVP status for a guest.
     */
    public function show(Request $request, $guestId)
    {
        // For now, we'll use user_id as guestId
        // In a real application, you might have a separate guest identifier
        $rsvps = Rsvp::where('user_id', $guestId)
            ->with(['event' => function ($query) {
                $query->where('is_active', true);
            }])
            ->get()
            ->map(function ($rsvp) use ($request) {
                $language = $request->header('Accept-Language', 'en') === 'bn' ? 'bn' : 'en';
                
                return [
                    'id' => $rsvp->id,
                    'event' => [
                        'id' => $rsvp->event->id,
                        'name' => $rsvp->event->getName($language),
                        'event_date' => $rsvp->event->event_date->toISOString(),
                    ],
                    'guest_count' => $rsvp->guest_count,
                    'dietary_restrictions' => $rsvp->dietary_restrictions,
                    'special_requests' => $rsvp->special_requests,
                    'status' => $rsvp->status,
                    'submitted_at' => $rsvp->created_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $rsvps,
        ]);
    }
}