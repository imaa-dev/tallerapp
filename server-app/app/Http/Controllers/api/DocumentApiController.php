<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\RepairDocumentService;
use Illuminate\Http\Request;

class DocumentApiController extends Controller
{
    use ApiResponse;

    protected RepairDocumentService $repairDocumentService;

    public function __construct(RepairDocumentService $repairDocumentService)
    {
        $this->repairDocumentService = $repairDocumentService;
    }

    public function filter(Request $request)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $filters = $request->only([
            'search', 'from', 'to',
            'sort', 'direction', 'page', 'per_page',
        ]);

        $documents = $this->repairDocumentService->getDocumentsByOrganization(
            $organizationId,
            $filters
        );

        return $this->success([
            'documents' => $documents->items(),
            'pagination' => [
                'current_page' => $documents->currentPage(),
                'last_page' => $documents->lastPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
                'from' => $documents->firstItem(),
                'to' => $documents->lastItem(),
            ],
        ], 'Documentos obtenidos correctamente', 200);
    }
}
