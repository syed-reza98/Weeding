<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transportation;
use Illuminate\Http\Request;

class TransportationController extends Controller
{
    /**
     * Display a listing of transportation options.
     */
    public function index(Request $request)
    {
        $request->validate([
            'route' => 'nullable|string',
        ]);

        $query = Transportation::query();

        if ($request->filled('route')) {
            $query->where('route_name', 'like', '%' . $request->route . '%');
        }

        $transportation = $query->orderBy('departure_time')->get();

        return response()->json([
            'success' => true,
            'data' => $transportation->map(function ($transport) {
                return [
                    'id' => $transport->id,
                    'route_name' => $transport->route_name,
                    'pickup_locations' => $transport->pickup_locations,
                    'departure_time' => $transport->departure_time,
                    'arrival_time' => $transport->arrival_time,
                    'driver_contact' => $transport->driver_contact,
                    'capacity' => $transport->capacity,
                ];
            }),
        ]);
    }

    /**
     * Display the specified transportation option.
     */
    public function show(Transportation $transportation)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $transportation->id,
                'route_name' => $transportation->route_name,
                'pickup_locations' => $transportation->pickup_locations,
                'departure_time' => $transportation->departure_time,
                'arrival_time' => $transportation->arrival_time,
                'driver_contact' => $transportation->driver_contact,
                'capacity' => $transportation->capacity,
            ],
        ]);
    }
}