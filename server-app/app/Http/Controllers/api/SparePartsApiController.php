<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\SparePartsService;
use Illuminate\Http\Request;

class SparePartsApiController extends Controller
{
    use ApiResponse;

    protected SparePartsService $sparePartsService;

    public function __construct(SparePartsService $sparePartsService)
    {
        $this->sparePartsService = $sparePartsService;
    }

    public function filter(Request $request)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $filters = $request->only([
            'search', 'brand', 'model',
            'sort', 'direction', 'page', 'per_page',
        ]);

        $spareParts = $this->sparePartsService->getByOrganization($organizationId, $filters);

        return $this->success([
            'spareParts' => $spareParts->items(),
            'pagination' => [
                'current_page' => $spareParts->currentPage(),
                'last_page' => $spareParts->lastPage(),
                'per_page' => $spareParts->perPage(),
                'total' => $spareParts->total(),
                'from' => $spareParts->firstItem(),
                'to' => $spareParts->lastItem(),
            ],
        ], 'Repuestos obtenidos correctamente', 200);
    }

    public function create(Request $request)
    {
        $request->validate([
            'model' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:255',
        ]);

        $organizationId = $request->user()->currentAccessToken()->organization_id;
        $userId = $request->user()->id;

        $sparePart = \App\Models\SpareParts::create([
            'organization_id' => $organizationId,
            'user_id' => $userId,
            'model' => $request->model,
            'brand' => $request->brand,
            'price' => $request->price,
            'note' => $request->note,
        ]);

        return $this->success($sparePart, 'Repuesto creado correctamente', 201);
    }

    public function delete(Request $request, int $id)
    {
        $this->sparePartsService->delete($id);

        return $this->success(null, 'Repuesto eliminado correctamente', 200);
    }
}
