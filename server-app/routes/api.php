<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\Auth\UserController;
use App\Http\Controllers\api\ServiController;

Route::post('/auth/login', [UserController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [UserController::class, 'logout']);
    Route::post('/get-list-count-services', [ServiController::class, 'listServices']);
});
