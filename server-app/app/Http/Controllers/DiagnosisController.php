<?php

namespace App\Http\Controllers;

use App\DTO\CreateDiagnosisDTO;
use App\Http\Requests\StoreDiagnosisRequest;
use App\Models\ServiceIssue;
use App\Services\DiagnosisService;
use Barryvdh\Snappy\Facades\SnappyPdf;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class DiagnosisController extends Controller
{

    private DiagnosisService $diagnosisService;

    public function __construct(DiagnosisService $diagnosisService)
    {
        $this->diagnosisService = $diagnosisService;
    }

    public function create(StoreDiagnosisRequest $request){
        $selectedIssues = $request->selected_issues;
        $dto = new CreateDiagnosisDTO($request);
        $issues = $this->diagnosisService->create($dto, $selectedIssues);
        return response()->json([
            'success' => true,
            'message' => 'Diagnóstico creado correctamente.',
            'data' => $issues,
        ]);
    }

    public function delete($id){
        $this->diagnosisService->clearDiagnosis($id);
        return response()->json([
            'success' => true,
            'message' => 'Diagnostico eliminado',
        ]);
    }

    public function publicDiagnosis(string $token)
    {
        $issue = $this->findByToken($token);

        if (! $issue->client_accessed) {
            $issue->update(['client_accessed' => true]);
        }

        $servi = $issue->servi()
            ->with(['client', 'product', 'organization', 'file'])
            ->first();

        return Inertia::render('diagnosis/Diagnosis', [
            'issue' => [
                'id' => $issue->id,
                'issue' => $issue->issue,
                'diagnosis' => $issue->diagnosis,
                'repair_time' => $issue->repair_time,
                'cost' => $issue->cost,
            ],
            'servi' => [
                'client_name' => $servi?->client?->name,
                'organization_name' => $servi?->organization?->name,
                'organization_description' => $servi?->organization?->description,
                'product_name' => $servi?->product?->name,
                'product_brand' => $servi?->product?->brand,
                'product_model' => $servi?->product?->model,
                'date_entry' => $servi?->date_entry
                    ? Carbon::parse($servi->date_entry)->format('d/m/Y')
                    : null,
                'files' => ($servi?->file ?? collect())->map(fn ($file) => $file->path)->values(),
            ],
            'pdf_url' => route('diagnosis.public.pdf', $issue->token),
        ]);
    }

    public function publicDiagnosisPdf(string $token)
    {
        $issue = $this->findByToken($token);

        if (! $issue->pdf_downloaded) {
            $issue->update(['pdf_downloaded' => true]);
        }

        $servi = $issue->servi()
            ->with(['client', 'product', 'organization', 'file'])
            ->first();

        $pdf = SnappyPdf::loadView('diagnosis.diagnosis_pdf', [
            'issue' => $issue,
            'servi' => $servi,
        ])->setOption('enable-local-file-access', true);

        return $pdf->download('diagnostico-servicio-'.$servi->id.'.pdf');
    }

    private function findByToken(string $token): ServiceIssue
    {
        $issue = ServiceIssue::where('token', $token)->first();

        if (! $issue) {
            abort(404, 'Diagnóstico no encontrado');
        }

        return $issue;
    }
}
