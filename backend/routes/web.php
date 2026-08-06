<?php

use App\Http\Controllers\Api\HomeController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', [HomeController::class, 'index']);

// Expose API root for frontend at /api and support preflight
Route::get('/api', [HomeController::class, 'index']);
Route::get('/api/{any}', [HomeController::class, 'index'])->where('any', '.*');
Route::options('/api/{any}', function () {
	return response()->json([], 200)
		->header('Access-Control-Allow-Origin', '*')
		->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
		->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');