<?php

namespace App\Services;

use App\Models\OrganizationUser;
use App\DTO\CreateUserOrganizationDTO;
use App\DTO\ServiceResult;
use Illuminate\Support\Facades\Log;

class UserOrganizationService
{

    public function createUserOrganization(CreateUserOrganizationDTO $dto)
    {   
        $organizationUser = OrganizationUser::create([
            'organization_id' => $dto->organization_id,
            'user_id' => $dto->user_id
        ]);
        
        return $organizationUser;
    }
}