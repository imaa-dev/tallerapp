<?php

namespace App\DTO;

class CreateUserOrganizationDTO
{
    public int $user_id;
    public int $organization_id;

    public function __construct($request)
    {
        $this->user_id = $request->userId;
        $this->organization_id = $request->organizationId;
    }
}