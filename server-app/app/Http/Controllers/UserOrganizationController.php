<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserOrganizationService;
use Illuminate\Support\Facades\Log;
use App\DTO\CreateUserOrganizationDTO;

class UserOrganizationController extends Controller
{
    protected UserOrganizationService $userOrganizationService;
    
    public function __construct(UserOrganizationService $userOrganizationService){
        $this->userOrganizationService = $userOrganizationService;
    }

    public function store (Request $request)
    {
        $dto = new CreateUserOrganizationDTO($request);
        $userOrganization = $this->userOrganizationService->createUserOrganization($dto);
        return response()->json([
            'success' => "true",
            'message' => "Usuario Tecnico agregado satisfactoriamente a organizacion",
            'code'    => 201,
            'data'    => $userOrganization,
        ]);
    }
}
