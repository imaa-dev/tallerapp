<?php
namespace App\DTO;

class CreateClientDTO
{
    public int $created_by_user_id;
    public string $name;
    public string $email;
    public string $phone;

    public function __construct($request)
    {
        $this->created_by_user_id = $request->user()->id;
        $this->name  = $request->name;
        $this->email = $request->email;
        $this->phone = $request->phone;
    }
}
