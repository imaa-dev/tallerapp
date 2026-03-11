<?php
namespace App\DTO;

class CreateTechnicianDTO
{
    public string $name;
    public string $email;
    public string $phone;

    public function __construct($request)
    {   
        $this->name  = $request->name;
        $this->email = $request->email;
        $this->phone = $request->phone;
        $this->password = $request->password;
    }
}
