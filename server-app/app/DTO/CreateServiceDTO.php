<?php

namespace App\DTO;

class CreateServiceDTO
{
    public int $user_id;
    public int $organization_id;
    public int $product_id;
    public int $status_id;
    public string $date_entry;

    public function __construct($request)
    {
        $this->user_id = $request->user_id;
        $this->organization_id = $request->organization_id;
        $this->product_id = $request->product_id;
        $this->status_id = $request->status_id;
        $this->date_entry = $request->date_entry;
    }
}
