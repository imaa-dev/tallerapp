<?php
namespace App\DTO\api;

class CreateClientDTOAPI
{
    public string $name;
    public string $email;
    public string $phone;
    public int $organization_id;

    public function __construct($request)
    {
        $this->name  = $request->name;
        $this->email = $request->email;
        $this->phone = $request->phone;
        $this->organization_id = $request->user()->currentAccessToken()->organization_id;
    }
}
