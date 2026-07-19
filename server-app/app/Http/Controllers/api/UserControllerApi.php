<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;
use App\DTO\api\CreateClientDTOAPI;

class UserControllerApi extends Controller
{
    public function __construct( UserService $userService ){
        $this->userService = $userService;
    }

    public function getClients(Request $request){

        $organization_id = $request->user()->currentAccessToken()->organization_id;
        $clients = $this->userService->listClients($organization_id);
        return response()->json([
            'clients' => $clients
        ]);
    }

    public function createClient(Request $request){
        $dto = new CreateClientDTOAPI($request);
        $result = $this->userService->createClientAPI($dto);
        return response()->json([
            'success' => $result->success,
            'message' => $result->message,
            'code'    => $result->code,
            'data'    => $result->data,
        ]);
    }
}
