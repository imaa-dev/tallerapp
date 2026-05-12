<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use Illuminate\Support\Facades\Log;

class UserControllerApi extends Controller
{
    public function __construct( UserService $userService ){
        $this->userService = $userService;
    }

    public function getClients(Request $request){
        $clients = $this->userService->listClients($request->organization_id);
        return response()->json([
            'clients' => $clients
        ]);
    }
}
