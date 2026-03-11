<?php
namespace App\DTO;

class CreateClientDTO
{
    public string $name;
    public string $email;
    public string $phone;

    public function __construct($request)
    {
        $this->name  = $request->name;
        $this->email = $request->email;
        $this->phone = $request->phone;
    }
}
