<?php
namespace App\Services;


use App\Models\ServiceIssue;

class ServiceIssueService{

    public function storeIssues($issues, $id): void
    {
        foreach ($issues as $issueInsert){
            ServiceIssue::create([
                'servi_id' => $id,
                'issue' => $issueInsert['issue'],
            ]);
        }

    }

    public function store($issue, $id)
    {
        return ServiceIssue::create([
            'servi_id' => $id,
            'issue' => $issue
        ]);
    }

    public function listByService(int $servi_id)
    {
        return ServiceIssue::where('servi_id', $servi_id)->orderBy('id')->get();
    }
    public function removeIssue(int $id): void
    {
        ServiceIssue::destroy($id);
    }

    public function addDiagnosisToIssues(array $selected_issues, int $servi_id, string $diagnosis, string $repair_time, float $cost): array
    {
        $updatedIssues = [];

        foreach ($selected_issues as $selected_issue){
            $issue = ServiceIssue::where('id', $selected_issue['value'])
                ->where('servi_id', $servi_id)
                ->first();

            if (! $issue) {
                continue;
            }

            $issue->update([
                'diagnosis' => $diagnosis,
                'repair_time' => $repair_time,
                'cost' => $cost,
                'attend' => true,
            ]);

            $updatedIssues[] = $issue;
        }

        return $updatedIssues;
    }

    public function clearDiagnosis(int $id): void
    {
        $issue = ServiceIssue::findOrFail($id);
        $issue->update([
            'diagnosis' => null,
            'repair_time' => null,
            'cost' => null,
            'attend' => false,
        ]);
    }
}
