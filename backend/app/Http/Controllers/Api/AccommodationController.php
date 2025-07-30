<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use Illuminate\Http\Request;

class AccommodationController extends Controller
{
    /**
     * Display a listing of accommodations.
     */
    public function index(Request $request)
    {
        $request->validate([
            'recommended_only' => 'nullable|boolean',
        ]);

        $query = Accommodation::query();

        if ($request->boolean('recommended_only')) {
            $query->where('is_recommended', true);
        }

        $accommodations = $query->orderBy('is_recommended', 'desc')
                               ->orderBy('name')
                               ->get();

        return response()->json([
            'success' => true,
            'data' => $accommodations->map(function ($accommodation) {
                return [
                    'id' => $accommodation->id,
                    'name' => $accommodation->name,
                    'description' => $accommodation->description,
                    'address' => $accommodation->address,
                    'phone' => $accommodation->phone,
                    'email' => $accommodation->email,
                    'website_url' => $accommodation->website_url,
                    'price_range' => $accommodation->price_range,
                    'amenities' => $accommodation->amenities,
                    'is_recommended' => $accommodation->is_recommended,
                ];
            }),
        ]);
    }

    /**
     * Display the specified accommodation.
     */
    public function show(Accommodation $accommodation)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $accommodation->id,
                'name' => $accommodation->name,
                'description' => $accommodation->description,
                'address' => $accommodation->address,
                'phone' => $accommodation->phone,
                'email' => $accommodation->email,
                'website_url' => $accommodation->website_url,
                'price_range' => $accommodation->price_range,
                'amenities' => $accommodation->amenities,
                'is_recommended' => $accommodation->is_recommended,
            ],
        ]);
    }
}