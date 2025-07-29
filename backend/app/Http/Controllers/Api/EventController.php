<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index(Request $request)
    {
        $language = $request->header('Accept-Language', 'en') === 'bn' ? 'bn' : 'en';
        
        $events = Event::where('is_active', true)
            ->orderBy('event_date', 'asc')
            ->get()
            ->map(function ($event) use ($language) {
                return [
                    'id' => $event->id,
                    'name' => $event->getName($language),
                    'description' => $event->getDescription($language),
                    'event_date' => $event->event_date->toISOString(),
                    'venue_name' => $event->venue_name,
                    'venue_address' => $event->venue_address,
                    'dress_code' => $event->getDressCode($language),
                    'is_active' => $event->is_active,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Display the specified event.
     */
    public function show(Request $request, $id)
    {
        $language = $request->header('Accept-Language', 'en') === 'bn' ? 'bn' : 'en';
        
        $event = Event::where('is_active', true)->find($id);

        if (!$event) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $event->id,
                'name' => $event->getName($language),
                'description' => $event->getDescription($language),
                'event_date' => $event->event_date->toISOString(),
                'venue_name' => $event->venue_name,
                'venue_address' => $event->venue_address,
                'dress_code' => $event->getDressCode($language),
                'is_active' => $event->is_active,
                'rsvp_count' => $event->rsvps()->confirmed()->sum('guest_count'),
                'media_count' => $event->media()->approved()->count(),
            ],
        ]);
    }
}