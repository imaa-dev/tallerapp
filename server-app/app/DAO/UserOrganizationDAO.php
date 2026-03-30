<?php

namespace App\DAO;
use App\Models\OrganizationUser;


class UserOrganizationDAO
{
    public function createUserOrganizationThechnician(array $data): OrganizationUser
    {
        return OrganizationUser::create($data);
    }
}