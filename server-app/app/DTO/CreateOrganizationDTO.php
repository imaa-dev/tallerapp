<?php

namespace App\DTO;

class CreateOrganizationDTO
{
    public int $id;
    public int $user_id;
    public string $name;
    public string $description;
    public bool $active;

    public function __construct($request)
    {
        $this->id = $request->id;
        $this->user_id = $request->user()->id;
        $this->name = $request->name;
        $this->description = $request->description;
        $this->active = $request->active;
    }
}
