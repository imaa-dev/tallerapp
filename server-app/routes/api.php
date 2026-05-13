<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\Auth\UserController;
use App\Http\Controllers\api\ServiController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\UserControllerApi;

Route::post('/auth/login', [UserController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [UserController::class, 'logout']);
    Route::post('/get-list-count-services', [ServiController::class, 'listServices']);
    Route::post('/get-clients', [UserControllerApi::class, 'getClients']);
    Route::post('/create-client', [UserControllerApi::class, 'createClient']);
    
    Route::post('/get-product', [ProductController:: class, 'getProduct']);
    Route::post('/create-product', [ProductController::class, 'createProduct']);

});
