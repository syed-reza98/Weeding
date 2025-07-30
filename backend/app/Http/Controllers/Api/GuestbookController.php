<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GuestbookMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuestbookController extends Controller
{
    /**
     * Display a listing of approved guestbook messages.
     */
    public function index(Request $request)
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'sort' => 'nullable|in:latest,oldest',
        ]);

        $perPage = $request->per_page ?? 20;
        $sort = $request->sort ?? 'latest';

        $query = GuestbookMessage::approved()->with('user');

        if ($sort === 'latest') {
            $query->latest();
        } else {
            $query->oldest();
        }

        $messages = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => collect($messages->items())->map(function ($message) {
                return [
                    'id' => $message->id,
                    'guest_name' => $message->guest_name,
                    'message' => $message->message,
                    'posted_at' => $message->created_at->toISOString(),
                ];
            }),
            'pagination' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
            ],
        ]);
    }

    /**
     * Store a newly created guestbook message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'guest_name' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        $guestbookMessage = GuestbookMessage::create([
            'user_id' => $user ? $user->id : null,
            'guest_name' => $request->guest_name,
            'message' => $request->message,
            'is_approved' => false, // Requires admin approval
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been submitted and will be visible once approved.',
            'data' => [
                'id' => $guestbookMessage->id,
                'guest_name' => $guestbookMessage->guest_name,
                'message' => $guestbookMessage->message,
                'is_approved' => $guestbookMessage->is_approved,
                'posted_at' => $guestbookMessage->created_at->toISOString(),
            ],
        ], 201);
    }

    /**
     * Display the specified guestbook message.
     */
    public function show(GuestbookMessage $guestbookMessage)
    {
        if (!$guestbookMessage->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or not approved',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $guestbookMessage->id,
                'guest_name' => $guestbookMessage->guest_name,
                'message' => $guestbookMessage->message,
                'posted_at' => $guestbookMessage->created_at->toISOString(),
            ],
        ]);
    }
}