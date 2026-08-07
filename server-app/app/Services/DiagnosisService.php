<?php

namespace App\Services;

use App\DTO\CreateDiagnosisDTO;

class DiagnosisService
{
    private ServiceIssueService $serviceIssueService;

    public function __construct(ServiceIssueService $serviceIssueService)
    {
        $this->serviceIssueService = $serviceIssueService;
    }

    public function create(CreateDiagnosisDTO $dto, array $issues_diagnosis)
    {
        return $this->serviceIssueService->addDiagnosisToIssues($issues_diagnosis, $dto->servi_id, $dto->diagnosis, $dto->repair_time, $dto->cost);
    }

    public function clearDiagnosis(int $issue_id): void
    {
        $this->serviceIssueService->clearDiagnosis($issue_id);
    }
}
