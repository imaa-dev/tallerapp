<?php

namespace App\DTO;

class CreateOrganizationDTO
{
    public int $id;
    public int $user_id;
    public string $name;
    public string $description;
    public ?string $address;
    public ?string $city;
    public ?string $state;
    public ?string $country;
    public ?string $postal_code;
    public ?string $phone;
    public ?string $email;
    public ?string $website;

    public function __construct($request)
    {
        $this->id = $request->id;
        $this->user_id = $request->user()->id;
        $this->name = $request->name;
        $this->description = $request->description;
        $this->address = $request->address;
        $this->city = $request->city;
        $this->state = $request->state;
        $this->country = $request->country;
        $this->postal_code = $request->postal_code;
        $this->phone = $request->phone;
        $this->email = $request->email;
        $this->website = $request->website;
    }
}
