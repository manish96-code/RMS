<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'RMS API Server is running',
        'status' => 'success'
    ]);
});