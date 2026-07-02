<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\RepairDocumentService;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class RepairDocumentsController extends Controller
{
    protected RepairDocumentService $repairDocumentService;

    public function __construct(
        RepairDocumentService $repairDocumentService
    )
    {
        $this->repairDocumentService = $repairDocumentService;
    }

    public function listDocuments(Request $request)
    {
        $organizationId = session('tenant_id');

        $filters = $request->only([
            'search',
            'service_id',
            'type',
            'from',
            'to',
            'sort',
            'direction',
            'page',
            'per_page'
        ]);

        $documents = $this->repairDocumentService
            ->getDocumentsByOrganization(
                $organizationId,
                $filters
            );

        return Inertia::render('documents/documents', [
            'documents' => $documents->items(),

            'pagination' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
                'from' => $documents->firstItem(),
                'to' => $documents->lastItem(),
            ],

            'filters' => $filters
        ]);
    }
    public function filterDocuments(Request $request): JsonResponse
    {
        $organizationId = session('tenant_id');

        $filters = $request->only([
            'search',
            'service_id',
            'type',
            'from',
            'to',
            'sort',
            'direction',
            'page',
            'per_page'
        ]);

        $documents = $this->repairDocumentService
            ->getDocumentsByOrganization(
                $organizationId,
                $filters
            );

        return response()->json([
            'success' => true,

            'documents' => $documents->items(),

            'pagination' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
                'from' => $documents->firstItem(),
                'to' => $documents->lastItem(),
            ]
        ]);
    }
}
