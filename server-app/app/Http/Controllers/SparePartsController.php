<?php

namespace App\Http\Controllers;

use App\DTO\CreateSparePartsDTO;
use App\Services\SparePartsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SparePartsController extends Controller
{
    private SparePartsService $sparePartsService;

    public function __construct(SparePartsService $sparePartsService)
    {
        $this->sparePartsService = $sparePartsService;
    }

    public function create(Request $request)
    {
        $dto = new CreateSparePartsDTO($request);
        $spare_part = $this->sparePartsService->createSparePart($dto);

        return response()->json([
            'success' => true,
            'message' => 'Pieza de repuesto creada satisfactoriamente',
            'spare_part' => $spare_part,
        ]);
    }

    public function spareParts(Request $request)
    {
        $this->sparePartsService->sparePartNotificate($request->servi_id, $request->spare_parts);

        return redirect()->route('services.view')
            ->with('message', 'Repuestos agregados al servicio');
    }

    public function getSpareParts(Request $request)
    {
        return response()->json(
            $this->sparePartsService->getSpareParts(session('tenant_id'))
        );
    }

    public function list(Request $request)
    {
        $organizationId = session('tenant_id');

        $filters = $request->only([
            'search',
            'brand',
            'model',
            'sort',
            'direction',
            'page',
            'per_page',
        ]);

        $spareParts = $this->sparePartsService->getByOrganization($organizationId, $filters);

        return Inertia::render('spare-parts/spareparts', [
            'spareParts' => $spareParts->items(),
            'pagination' => [
                'current_page' => $spareParts->currentPage(),
                'last_page' => $spareParts->lastPage(),
                'per_page' => $spareParts->perPage(),
                'total' => $spareParts->total(),
                'from' => $spareParts->firstItem(),
                'to' => $spareParts->lastItem(),
            ],
            'filters' => $filters,
        ]);
    }

    public function filterSpareParts(Request $request)
    {
        $organizationId = session('tenant_id');

        $filters = $request->only([
            'search',
            'brand',
            'model',
            'sort',
            'direction',
            'page',
            'per_page',
        ]);

        $spareParts = $this->sparePartsService->getByOrganization($organizationId, $filters);

        return response()->json([
            'success' => true,
            'spareParts' => $spareParts->items(),
            'pagination' => [
                'current_page' => $spareParts->currentPage(),
                'last_page' => $spareParts->lastPage(),
                'per_page' => $spareParts->perPage(),
                'total' => $spareParts->total(),
                'from' => $spareParts->firstItem(),
                'to' => $spareParts->lastItem(),
            ],
            'filters' => $filters,
        ]);
    }

    public function deleteSparePart($id)
    {
        $this->sparePartsService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Repuesto eliminado satisfactoriamente',
        ]);
    }

    public function removeFromService(Request $request)
    {
        $request->validate([
            'servi_id' => 'required|integer',
            'spare_part_id' => 'required|integer',
        ]);

        $this->sparePartsService->removeFromService(
            $request->servi_id,
            $request->spare_part_id
        );

        return redirect()->back()
            ->with('message', 'Repuesto quitado del servicio');
    }
}
