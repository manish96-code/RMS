<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\Api\TableController;

Route::get('/', [HomeController::class, 'index']);
Route::get('/home', [HomeController::class, 'index']);
Route::get('/restaurant-home', [HomeController::class, 'index']);
Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);

// Dish Management APIs for Admin & App
Route::get('/dishes', [DishController::class, 'index']);
Route::post('/dishes', [DishController::class, 'store']);
Route::post('/admin/dishes', [DishController::class, 'store']);
Route::post('/create-dish', [DishController::class, 'store']);
Route::get('/dishes/{id}', [DishController::class, 'show']);
Route::put('/dishes/{id}', [DishController::class, 'update']);
Route::delete('/dishes/{id}', [DishController::class, 'destroy']);

// Table Management APIs for Admin & App
Route::get('/tables', [TableController::class, 'index']);
Route::post('/tables', [TableController::class, 'store']);
Route::post('/admin/tables', [TableController::class, 'store']);
Route::post('/create-table', [TableController::class, 'store']);
Route::get('/tables/{id}', [TableController::class, 'show']);
Route::put('/tables/{id}', [TableController::class, 'update']);
Route::delete('/tables/{id}', [TableController::class, 'destroy']);

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
