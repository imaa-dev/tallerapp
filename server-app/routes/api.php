<?php

use App\Http\Controllers\api\Auth\UserController;
use App\Http\Controllers\api\DashboardApiController;
use App\Http\Controllers\api\DocumentApiController;
use App\Http\Controllers\api\OrganizationApiController;
use App\Http\Controllers\api\ProductController;
use App\Http\Controllers\api\ProfileController;
use App\Http\Controllers\api\ServiController;
use App\Http\Controllers\api\SparePartsApiController;
use App\Http\Controllers\api\SubscriptionApiController;
use App\Http\Controllers\api\UserApiController;
use App\Http\Controllers\api\UserControllerApi;
use App\Http\Controllers\api\WorkshopTypeController;
use App\Http\Controllers\PaymentWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [UserController::class, 'store']);
Route::post('/auth/register', [UserController::class, 'register']);
Route::post('/auth/complete-login', [UserController::class, 'completeLogin']);
Route::get('/workshop-types', [WorkshopTypeController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // Service
    Route::post('/get-list-count-services', [ServiController::class, 'listServices']);
    Route::post('/create-service', [ServiController::class, 'create']);
    Route::post('/get-services', [ServiController::class, 'getServices']);
    Route::get('/services/{id}', [ServiController::class, 'detail']);
    Route::post('/services/{id}/advance', [ServiController::class, 'advanceStatus']);
    Route::post('/services/{id}/to-diagnosis', [ServiController::class, 'toDiagnosis']);
    Route::post('/services/{id}/go-back', [ServiController::class, 'goBack']);
    Route::post('/services/{id}/diagnosis', [ServiController::class, 'updateDiagnosis']);
    Route::post('/services/{id}/diagnosis-issue', [ServiController::class, 'addDiagnosis']);
    Route::post('/services/{id}/to-spare-parts', [ServiController::class, 'toSpareParts']);
    Route::post('/services/{id}/to-cost-approval', [ServiController::class, 'toCostApproval']);
    Route::post('/services/{id}/upload-images', [ServiController::class, 'uploadImages']);
    Route::delete('/services/{id}/images/{fileId}', [ServiController::class, 'deleteImage']);
    Route::post('/services/{id}/approve-spare-parts', [ServiController::class, 'approveSpareParts']);
    Route::post('/services/{id}/assign-spare-parts', [ServiController::class, 'assignSpareParts']);
    Route::post('/services/{id}/remove-spare-part', [ServiController::class, 'removeSparePart']);
    Route::post('/services/{id}/approve-cost', [ServiController::class, 'approveCost']);
    Route::post('/services/{id}/start-repair', [ServiController::class, 'startRepair']);
    Route::post('/services/{id}/complete-repair', [ServiController::class, 'completeRepair']);
    Route::post('/services/{id}/deliver', [ServiController::class, 'deliver']);

    // Profile / Settings
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    // Client
    Route::post('/get-clients', [UserControllerApi::class, 'getClients']);
    Route::post('/create-client', [UserControllerApi::class, 'createClient']);

    // Product
    Route::post('/get-product', [ProductController::class, 'getProduct']);
    Route::post('/create-product', [ProductController::class, 'createProduct']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardApiController::class, 'stats']);

    // Organization
    Route::get('/organization', [OrganizationApiController::class, 'show']);
    Route::put('/organization', [OrganizationApiController::class, 'update']);

    // Users (technicians/clients)
    Route::get('/users', [UserApiController::class, 'list']);
    Route::post('/users/client', [UserApiController::class, 'storeClient']);
    Route::post('/users/technician', [UserApiController::class, 'storeTechnician']);
    Route::put('/users', [UserApiController::class, 'update']);
    Route::delete('/users/{id}', [UserApiController::class, 'delete']);

    // Spare Parts
    Route::get('/spare-parts', [SparePartsApiController::class, 'filter']);
    Route::post('/spare-parts', [SparePartsApiController::class, 'create']);
    Route::delete('/spare-parts/{id}', [SparePartsApiController::class, 'delete']);

    // Documents
    Route::get('/documents', [DocumentApiController::class, 'filter']);

    // Subscription
    Route::get('/subscription', [SubscriptionApiController::class, 'show']);
    Route::get('/subscription/plans', [SubscriptionApiController::class, 'plans']);

    // Logout
    Route::post('/auth/logout', [UserController::class, 'logout']);
});

// Payment Webhooks
Route::post('/paypal/webhook', [PaymentWebhookController::class, 'handlePaypal'])->name('webhook.paypal');
Route::post('/mercadopago/webhook', [PaymentWebhookController::class, 'handleMercadoPago'])->name('webhook.mercadopago');
