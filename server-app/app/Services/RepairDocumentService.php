<?php

namespace App\Services;
use App\Models\RepairDocument;

class RepairDocumentService
{
    public function getDocumentsByOrganization(int $organization_id){
        return RepairDocument::where('organization_id', $organization_id)->get();
    }
}