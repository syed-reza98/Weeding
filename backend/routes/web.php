<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Wedding Website Backend API',
        'version' => '1.0.0',
        'documentation' => url('/api/health'),
    ]);
});