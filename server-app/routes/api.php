<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\Auth\UserController;
use App\Http\Controllers\api\ServiController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\UserControllerApi;
use App\Http\Controllers\PayPalWebhookController;

Route::post('/auth/login', [UserController::class, 'store']);
Route::post('/auth/complete-login', [UserController::class, 'completeLogin']);
Route::middleware('auth:sanctum')->group(function () {
    // Service
    Route::post('/get-list-count-services', [ServiController::class, 'listServices']);
    Route::post('/create-service', [ServiController::class, 'create']);
    // Client
    Route::post('/get-clients', [UserControllerApi::class, 'getClients']);
    Route::post('/create-client', [UserControllerApi::class, 'createClient']);

    // Product
    Route::post('/get-product', [ProductController:: class, 'getProduct']);
    Route::post('/create-product', [ProductController::class, 'createProduct']);

    // Logout
    Route::post('/auth/logout', [UserController::class, 'logout']);

});

// PayPal Webhooks
Route::post('/paypal/webhook', [PayPalWebhookController::class, 'handle']);
