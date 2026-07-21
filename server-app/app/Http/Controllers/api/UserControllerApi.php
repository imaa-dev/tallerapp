<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;
use App\DTO\api\CreateClientDTOAPI;

class UserControllerApi extends Controller
{
    use ApiResponse;
    public function __construct( UserService $userService ){
        $this->userService = $userService;
    }

    public function getClients(Request $request){

        $organization_id = $request->user()->currentAccessToken()->organization_id;
        $clients = $this->userService->listClients($organization_id);
        Log::info($clients);
        return $this->success(
            $clients,
            "Clientes obtenidos correctamente",
            200
        );
    }

    public function createClient(Request $request){
        $dto = new CreateClientDTOAPI($request);
        $client = $this->userService->createClientAPI($dto);
        return $this->success(
            $client,
            "Cliente creado satisfactoriamente",
            200
        );
    }
}
