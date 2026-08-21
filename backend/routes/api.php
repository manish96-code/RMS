<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AdminController;

Route::get('/', [HomeController::class, 'index']);
Route::get('/home', [HomeController::class, 'index']);
Route::get('/restaurant-home', [HomeController::class, 'index']);
Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
Route::get('/stdcall', [StudentController::class, 'index'])->name('stdcall');
Route::get('/students', [StudentController::class, 'index']);
Route::post('/create-student', [StudentController::class, 'createStudent']);
Route::post('/students', [StudentController::class, 'createStudent']);
Route::get('/students/{id}', [StudentController::class, 'showStudent']);
Route::put('/students/{id}', [StudentController::class, 'updateStudent']);
Route::post('/students/{id}', [StudentController::class, 'updateStudent']);
Route::put('/update-student/{id}', [StudentController::class, 'updateStudent']);
Route::post('/update-student/{id}', [StudentController::class, 'updateStudent']);
Route::delete('/students/{id}', [StudentController::class, 'deleteStudent']);
Route::delete('/delete-student/{id}', [StudentController::class, 'deleteStudent']);



// Respond to preflight requests for any path under /api
Route::options('{any}', function () {
    return response()->json([], 200)->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');
