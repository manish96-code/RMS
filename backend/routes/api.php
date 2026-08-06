<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;

Route::get('/', [HomeController::class, 'index']);

// Respond to preflight requests for any path under /api
Route::options('{any}', function () {
    return response()->json([], 200)->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');
