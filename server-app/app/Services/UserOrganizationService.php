<?php

namespace App\Services;

use App\DAO\UserOrganizationDAO;
use App\DTO\CreateUserOrganizationDTO;
use App\DTO\ServiceResult;
use Illuminate\Support\Facades\Log;

class UserOrganizationService
{

    private UserOrganizationDAO $userOrganizationDAO;

    public function __construct(UserOrganizationDAO $userOrganizationDAO)
    {
        $this->userOrganizationDAO = $userOrganizationDAO;
    }

    public function createUserOrganization(CreateUserOrganizationDTO $dto): ServiceResult
    {   
        try {
            $organizationUser = $this->userOrganizationDAO->createUserOrganizationThechnician([
                'organization_id' => $dto->organization_id,
                'user_id' => $dto->user_id
            ]);
            return ServiceResult::success(
                $organizationUser,
                'Usuario Tecnico agregado satisfactoriamente a organizacion',
                201
            );
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return ServiceResult::fail(
                false,
                503,
                'ERROR',
            );
        }
        
    }
}