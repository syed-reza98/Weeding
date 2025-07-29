<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    /**
     * Display content for a specific section.
     */
    public function show(Request $request, $section)
    {
        $language = $request->header('Accept-Language', 'en') === 'bn' ? 'bn' : 'en';
        
        // Validate section parameter
        $allowedSections = [
            'home',
            'about',
            'events',
            'accommodations',
            'transportation',
            'gallery',
            'contact',
            'faq',
            'travel-guide',
        ];

        if (!in_array($section, $allowedSections)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid section requested',
            ], 400);
        }

        $content = Content::getSection($section, $language);

        if (empty($content)) {
            return response()->json([
                'success' => false,
                'message' => 'Content not found for this section',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'section' => $section,
                'language' => $language,
                'content' => $content,
            ],
        ]);
    }

    /**
     * Get specific content by section and key.
     */
    public function getByKey(Request $request, $section, $key)
    {
        $language = $request->header('Accept-Language', 'en') === 'bn' ? 'bn' : 'en';
        
        $content = Content::getByKey($section, $key, $language);

        if (!$content) {
            return response()->json([
                'success' => false,
                'message' => 'Content not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'section' => $section,
                'key' => $key,
                'language' => $language,
                'content' => $content,
            ],
        ]);
    }

    /**
     * Get all available sections.
     */
    public function sections()
    {
        $sections = Content::select('section')
            ->distinct()
            ->pluck('section')
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => $sections,
        ]);
    }
}