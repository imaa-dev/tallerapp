<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ServiService;
use Illuminate\Support\Facades\Log;

class ServiController extends Controller
{

    protected ServiService $serviService;
    public function __construct(ServiService $serviService)
    {
        $this->serviService = $serviService;
    }
    public function listServices(Request $request)
    {
        $organization_id = $request->organization_id;
        $coutTypeService = $this->serviService
            ->getCountTypeServiceR($organization_id);
        return response()->json([
            "countTypeService" => $coutTypeService 
        ]);
    }

}
