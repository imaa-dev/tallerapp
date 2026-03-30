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
        $organizationId = $request->organization_id;
        $coutTypeService = $this->serviService
            ->getCountTypeServiceR($organizationId);
        return response()->json([
            "countTypeService" => $coutTypeService 
        ]);
    }

}
