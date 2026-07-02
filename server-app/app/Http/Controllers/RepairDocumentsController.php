<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\RepairDocumentService;

class RepairDocumentsController extends Controller
{
    protected RepairDocumentService $repairDocumentService;

    public function __construct(
        RepairDocumentService $repairDocumentService
    )
    {
        $this->repairDocumentService = $repairDocumentService;
    }

    public function listDocuments(){
        $organization_id = session('tenant_id');
        $documents = $this->repairDocumentService->getDocumentsByOrganization($organization_id);
        return Inertia::render('documents/documents', [
            'documents' => $documents
        ]);
    }
}
