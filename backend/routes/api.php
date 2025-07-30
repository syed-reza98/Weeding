<?php

use App\Http\Controllers\Api\AccommodationController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\GuestbookController;
use App\Http\Controllers\Api\RsvpController;
use App\Http\Controllers\Api\TransportationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::get('/accommodations', [AccommodationController::class, 'index']);
Route::get('/accommodations/{accommodation}', [AccommodationController::class, 'show']);
Route::get('/transportation', [TransportationController::class, 'index']);
Route::get('/transportation/{transportation}', [TransportationController::class, 'show']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/gallery/{media}', [GalleryController::class, 'show']);
Route::get('/guestbook', [GuestbookController::class, 'index']);
Route::get('/guestbook/{guestbookMessage}', [GuestbookController::class, 'show']);
Route::get('/content/{section}', [ContentController::class, 'show']);
Route::get('/content/{section}/{key}', [ContentController::class, 'getByKey']);
Route::get('/content-sections', [ContentController::class, 'sections']);

// Authentication required routes
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    });

    // RSVP management
    Route::post('/rsvp', [RsvpController::class, 'store']);
    Route::get('/rsvp/{guestId}', [RsvpController::class, 'show']);

    // Gallery uploads
    Route::post('/gallery/upload', [GalleryController::class, 'upload']);

    // Guestbook messages
    Route::post('/guestbook', [GuestbookController::class, 'store']);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'Wedding Website API is running',
        'version' => '1.0.0',
        'timestamp' => now()->toISOString(),
    ]);
});