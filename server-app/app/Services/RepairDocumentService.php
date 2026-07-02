<?php

namespace App\Services;
use App\Models\RepairDocument;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class RepairDocumentService
{
    public function getDocumentsByOrganization(
        int $organizationId,
        array $filters = []
    ): LengthAwarePaginator {

        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = $filters['per_page'] ?? 12;

        return RepairDocument::query()
            ->where('organization_id', $organizationId)
            ->filter($filters)
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }
}