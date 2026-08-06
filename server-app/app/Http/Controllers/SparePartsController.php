<?php

namespace App\Http\Controllers;

use App\DTO\CreateSparePartsDTO;
use App\Models\Servi;
use App\Models\User;
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
        $notificate = $request->notificate;
        $notificate_client = $request->notificate_client;
        $spare_parts = $request->spare_parts;
        $service_id = $request->servi_id;
        $this->sparePartsService->sparePartNotificate($service_id, $notificate, $notificate_client, $spare_parts);

        return redirect()->route('services.view')
            ->with('message', 'Aprovacion en curso de ser atendida por cliente via correo');
    }

    public function approve(Request $request, $token)
    {

        $action = $request->query('action');
        $uuid = $request->query('uuid');
        if (! in_array($action, ['approve', 'reject'])) {
            abort(400);
        }

        $user = User::where('approval_token', $token)
            ->where('token_expires_at', '>', now())
            ->first();

        if (! $user) {
            return view('client.rejected');
        }

        $approved = $action === 'approve';

        Servi::where('uuid', $uuid)->update([
            'approve_spare_parts' => $approved,
        ]);

        $user->update([
            'approval_token' => null,
            'token_expires_at' => null,
        ]);

        return view(
            $approved
                ? 'client.success'
                : 'client.rejected'
        );
    }

    public function getSpareParts(Request $request)
    {
        return response()->json(
            $this->sparePartsService->getSpareParts($request->user()->id)
        );
    }

    public function list(Request $request)
    {
        $spareParts = [];
        $organizationId = session('tenant_id');
        $user = $request->user();

        if (! $organizationId) {
            $message = '';

            if ($user->rol === 'ADMIN') {
                $message = 'No tienes una organización creada. Debes crear una organización para comenzar.';
            }

            if ($user->rol === 'TECHNICIAN') {
                $message = 'No tienes una organización asignada. Contacta a un administrador.';
            }

            return Inertia::render('spare-parts/spareparts', [
                'notOrganization' => true,
                'spareParts' => [],
                'pagination' => null,
                'filters' => [],
                'message' => $message,
                'user_rol' => $user->rol,
            ]);
        }

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
            'notOrganization' => false,
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
            'message' => null,
            'user_rol' => $user->rol,
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
}
