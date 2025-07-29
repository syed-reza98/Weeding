<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    /**
     * Display a listing of media in the gallery.
     */
    public function index(Request $request)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
            'type' => 'nullable|in:image,video',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = Media::approved()->with(['user', 'event']);

        if ($request->event_id) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->type) {
            if ($request->type === 'image') {
                $query->where('file_type', 'like', 'image/%');
            } elseif ($request->type === 'video') {
                $query->where('file_type', 'like', 'video/%');
            }
        }

        $perPage = $request->per_page ?? 20;
        $media = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $media->items(),
            'pagination' => [
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
                'per_page' => $media->perPage(),
                'total' => $media->total(),
            ],
        ]);
    }

    /**
     * Upload media files to the gallery.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'required|file|mimes:jpeg,jpg,png,gif,mp4,mov,avi|max:50000', // 50MB max
            'event_id' => 'nullable|exists:events,id',
            'caption' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('media', $filename, 'public');

            $media = Media::create([
                'user_id' => $user->id,
                'event_id' => $request->event_id,
                'filename' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'caption' => $request->caption,
                'is_approved' => false, // Requires admin approval
            ]);

            $uploadedFiles[] = [
                'id' => $media->id,
                'filename' => $media->filename,
                'file_type' => $media->file_type,
                'file_size' => $media->file_size,
                'caption' => $media->caption,
                'is_approved' => $media->is_approved,
                'uploaded_at' => $media->created_at->toISOString(),
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Files uploaded successfully. They will be visible once approved.',
            'data' => $uploadedFiles,
        ], 201);
    }

    /**
     * Display the specified media item.
     */
    public function show(Media $media)
    {
        if (!$media->is_approved) {
            return response()->json([
                'success' => false,
                'message' => 'Media not found or not approved',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $media->id,
                'filename' => $media->filename,
                'url' => $media->url,
                'file_type' => $media->file_type,
                'file_size' => $media->file_size,
                'caption' => $media->caption,
                'uploaded_by' => $media->user ? $media->user->name : 'Anonymous',
                'event' => $media->event ? [
                    'id' => $media->event->id,
                    'name' => $media->event->name_en,
                ] : null,
                'uploaded_at' => $media->created_at->toISOString(),
            ],
        ]);
    }
}