<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BillingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\KitchenController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TableController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index']);
Route::get('/home', [HomeController::class, 'index']);
Route::get('/restaurant-home', [HomeController::class, 'index']);

// Authentication API
Route::post('/login', [AuthController::class, 'login']);

// Legacy public endpoints
Route::get('/dishes', [DishController::class, 'index']);
Route::get('/dishes/{id}', [DishController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Sanctum Protected - Accessible by Admin & Staff)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::put('/change-password', [ProfileController::class, 'changePassword']);

    // Order Management APIs (Module 5 - Accessible by Admin & Staff)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // Kitchen & KOT Management APIs (Module 6 - Accessible by Admin & Staff)
    Route::get('/kitchen/orders', [KitchenController::class, 'index']);
    Route::patch('/kitchen/orders/{id}/preparing', [KitchenController::class, 'markPreparing']);
    Route::patch('/kitchen/orders/{id}/ready', [KitchenController::class, 'markReady']);

    // Billing & Payment APIs (Module 7 - Accessible by Admin & Staff)
    Route::get('/orders/{id}/bill', [BillingController::class, 'show']);
    Route::post('/orders/{id}/payment', [PaymentController::class, 'store']);
    Route::get('/orders/{id}/payment', [PaymentController::class, 'show']);
    Route::get('/orders/{id}/receipt', [BillingController::class, 'receipt']);

    // Category & Menu Item Read APIs (Module 3)
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/menu-items', [MenuItemController::class, 'index']);
    Route::get('/menu-items/{id}', [MenuItemController::class, 'show']);

    // Table Management Read APIs (Module 4)
    Route::get('/tables', [TableController::class, 'index']);
    Route::get('/tables/{id}', [TableController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Admin Only Routes (Role Authorized Write/Delete Operations)
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {
        // Table Management APIs (Module 4)
        Route::post('/tables', [TableController::class, 'store']);
        Route::put('/tables/{id}', [TableController::class, 'update']);
        Route::delete('/tables/{id}', [TableController::class, 'destroy']);
        Route::patch('/tables/{id}/status', [TableController::class, 'updateStatus']);

        // Category Management APIs (Module 3)
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Menu Item Management APIs (Module 3)
        Route::post('/menu-items', [MenuItemController::class, 'store']);
        Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);
        Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);
        Route::patch('/menu-items/{id}/availability', [MenuItemController::class, 'updateAvailability']);

        // Restaurant Setup & Profile APIs (Module 2)
        Route::get('/restaurant', [RestaurantController::class, 'show']);
        Route::post('/restaurant', [RestaurantController::class, 'store']);
        Route::put('/restaurant', [RestaurantController::class, 'update']);
        Route::post('/restaurant/logo', [RestaurantController::class, 'uploadLogo']);

        // Staff Management APIs (Module 1)
        Route::get('/staff', [StaffController::class, 'index']);
        Route::post('/staff', [StaffController::class, 'store']);
        Route::get('/staff/{id}', [StaffController::class, 'show']);
        Route::put('/staff/{id}', [StaffController::class, 'update']);
        Route::delete('/staff/{id}', [StaffController::class, 'destroy']);
        Route::put('/staff/{id}/toggle-status', [StaffController::class, 'toggleStatus']);

        // Legacy Admin endpoints
        Route::post('/dishes', [DishController::class, 'store']);
        Route::post('/admin/dishes', [DishController::class, 'store']);
        Route::put('/dishes/{id}', [DishController::class, 'update']);
        Route::delete('/dishes/{id}', [DishController::class, 'destroy']);
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    });
});

// Options Preflight handling for CORS
Route::options('{any}', function () {
    return response()->json([], 200)->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');
