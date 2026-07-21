<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use Illuminate\Http\Request;
use App\Services\ServiService;
use Illuminate\Support\Facades\Log;

class ServiController extends Controller
{
    use ApiResponse;
    protected ServiService $serviService;
    public function __construct(ServiService $serviService)
    {
        $this->serviService = $serviService;
    }
    public function listServices(Request $request)
    {
        $organization_id = $request->user()->currentAccessToken()->organization_id;
        $countTypeService = $this->serviService
            ->getCountTypeServiceR($organization_id);
        return $this->success(
            $countTypeService,
            "Servicios obtenidos",
            200
        );
    }

    public function create(StoreServiceRequest $request)
    {
        $this->serviService->create($request->validated(), $request->file('file'), $request->user()->id, $request->reasonNotes);

        return $this->success(
            null,
            'Servicio creado correctamente',
            200
        );
    }

}
