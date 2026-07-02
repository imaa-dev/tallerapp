<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReasonController;
use App\Http\Controllers\SparePartsController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\UserOrganizationController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\RepairDocumentsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Service routes
    Route::get('service', [ServiController::class, 'show'])->name('services.view');
    Route::get('create/service', [ServiController::class, 'create'])->name('services.create.view');
    Route::get('edit/{servi}/service', [ServiController::class, 'getUpdate'])->name('services.update.view');
    Route::get('list-reception/service', [ServiController::class, 'listReception'])->name('services.list.reception.view');
    Route::get('list-repair/service', [ServiController::class, 'listRepair'])->name('services.list.repair.view');
    Route::get('list-repaired/service', [ServiController::class, 'listRepaired'])->name('services.list.repaired.view');
    Route::get('list-diagnosis/service', [ServiController::class, 'listDiagnosis'])->name('service.list.in.diagnosis.view');
    Route::get('list-to-aprove-spare-part/service', [ServiController::class, 'listToSparePart'])->name('service.list.to.aprove.spare.part');
    Route::get('list-delivered/service', [ServiController::class, 'listDelivered'])->name('service.list.delivered.view');
    Route::post('create/service', [ServiController::class, 'store'])->name('services.store')->middleware('organization.active');
    Route::post('manage/service', [ServiController::class, 'update'])->name('services.update')->middleware('organization.active');
    Route::delete('delete/service/{id}', [ServiController::class, 'delete'])->name('services.destroy');
    Route::post('to-repair/service', [ServiController::class, 'toRepaired'])->name('service.list.to.repaired')->middleware('organization.active');
    Route::post('to-diagnosis/service', [ServiController::class, 'toDiagnosis'])->name('service.list.to.diagnosis')->middleware('organization.active');
    Route::post('to-go-back/service', [ServiController::class, 'toGoBack'])->name('service.to.go.back')->middleware('organization.active');
    Route::post('to-aprove-spare-part/service', [ServiController::class, 'toAproveSpareParts'])->name('service.to.aprove.spare.part')->middleware('organization.active');
    Route::post('to-repaired/service', [ServiController::class, 'repairService'])->name('service.to.repaired')->middleware('organization.active');
    Route::post('repair/service', [ServiController::class, 'repairService'])->name('service.repair')->middleware('organization.active');
    Route::post('to-delivered/service', [ServiController::class, 'toDelivered'])->name('service.to.delivered')->middleware('organization.active');

    // Product routes
    Route::get('product', [ProductController::class, 'list'])->name('products.list.view');
    Route::get('create/product', [ProductController::class, 'create'])->name('product.create.view');
    Route::post('create/product', [ProductController::class, 'store'])->name('product.store')->middleware('organization.active');
    Route::get('update/{product}/product', [ProductController::class, 'getUpdate'])->name('product.update.view');
    Route::post('update/product', [ProductController::class, 'update'])->name('products.update')->middleware('organization.active');
    Route::delete('delete/product/{id}', [ProductController::class, 'delete'])->name('products.destroy')->middleware('organization.active');
    Route::post('products', [ProductController::class, 'get'])->name('products.get.all');
    Route::get('/product/filter', [ProductController::class, 'filterProducts'])
    ->name('products.filter');

    // Organization routes
    Route::get('list/organization', [OrganizationController::class, 'list'])->name('organization.list.view');
    Route::get('create/organization', [OrganizationController::class, 'create'])->name('organization.create.view');
    Route::get('organization/{organization}/edit', [OrganizationController::class, 'getUpdate'])->name('organization.update.view');
    Route::get('organization/show', [OrganizationController::class, 'show'])->name('organization.show.view');
    Route::post('create/organization', [OrganizationController::class, 'store'])->name('organizations.store')->middleware('organization.active');
    Route::post('organization/edit', [OrganizationController::class, 'update'])->name('organizations.update')->middleware('organization.active');
    Route::delete('organization/delete/{id}', [OrganizationController::class, 'delete'])->name('organizations.destroy')->middleware('organization.active');
    Route::get('select-organization', [OrganizationController::class, 'selectOrganization'])->name('select.organization');
    Route::post('set-organization', [OrganizationController::class, 'setOrganization'])->name('set.organization');

    // User routes
    Route::get('create/user-client', [UserController::class, 'create'])->name('users.create.client.view');
    Route::get('create/user-technician',[UserController::class, 'createTechnician'])->name('user.create.technician.view');
    Route::get('users', [UserController::class, 'listUsers'])->name('users.list.view');
    Route::get('update/{user}/user-client', [UserController::class, 'getUpdateClient'])->name('users.update.client.view');
    Route::post('create/user-client', [UserController::class, 'storeClient'])->name('users.store.client')->middleware('organization.active');
    Route::delete('delete-client/{id}', [UserController::class, 'deleteClient'])->name('users.client.destroy')->middleware('organization.active');
    Route::post('update-client', [UserController::class, 'updateClient'])->name('users.client.update')->middleware('organization.active');
    Route::post('/create/user-technician', [UserController::class, 'storeTechnician'])->name('user.technician.store')->middleware('organization.active');
    Route::get('clients', [UserController::class, 'listClients'])->name('user.client.view');
    Route::get('/users/filter', [UserController::class, 'filterUsers'])
        ->name('users.filter');

    // File routes
    Route::delete('delete-image-service/{id}', [FileController::class, 'removeImage'])->name('service.file.delete');
    Route::post('upload-image-service', [FileController::class, 'uploadImage'])->name('service.file.upload');

    // Reason routes
    Route::post('store-reason-service', [ReasonController::class, 'store'])->name('reason.store');
    Route::delete('delete-reason-service/{id}', [ReasonController::class, 'delete'])->name('reason.delete');

    // Spare Parts routes
    Route::post('create/spare-parts', [SparePartsController::class, 'create'])->name('spare.parts.create')->middleware('organization.active');
    Route::post('create-spare-parts-notificate', [SparePartsController::class, 'spareParts'])->name('spare.receipt.parts.create')->middleware('organization.active');
    Route::post('get-spareparts', [SparePartsController::class, 'getSpareParts'])->name('get.spare.parts')->middleware('organization.active');
    // Diagnosis routes
    Route::post('create/diagnosis', [DiagnosisController::class, 'create'])->name('diagnosis.create')->middleware('organization.active')->middleware('organization.active');
    Route::delete('delete/diagnosis/{id}', [DiagnosisController::class, 'delete'])->name('diagnosis.delete')->middleware('organization.active')->middleware('organization.active');

    // Verification user email
    Route::post('send-code-verificate-email/user', [VerifyEmailController::class, 'sendVerificationCode'])->name('send.code.verificate.email');
    Route::post('verificate-code/user', [VerifyEmailController::class, 'verifyCode'])->name('code.verify');
    Route::post('resend-code-verificate-email/user', [VerifyEmailController::class, 'resendVerificationCode'])->name('resend.code.verificate.email');

    // Organization User
    Route::post('store/user-technician-organization', [UserOrganizationController::class, 'store'])->name('user.organization.technician');

    // Subscription
    Route::get('payments-subscriptions', [SubscriptionController::class, 'showSubscriptionForm'])->name('subscription.form.view');

    // Repair Documents

    Route::get('repair-documents', [RepairDocumentsController:: class, 'listDocuments'])->name('repair.documents.view');
    Route::get(
        '/reports/filter',
        [RepairDocumentsController::class, 'filterDocuments']
    );
});

Route::get('approve/spare-parts/{token}', [SparePartsController::class, 'approve'])->name('spare.parts.approve');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
