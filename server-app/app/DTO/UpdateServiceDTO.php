<?php

namespace App\DTO;

class UpdateServiceDTO
{
    public int $id;
    public int $user_id;
    public int $organization_id;
    public int $product_id;
    public string $date_entry;
    public function __construct($request)
    {
        $this->id = $request->id;
        $this->user_id = $request->user_id;
        $this->organization_id = $request->organization_id;
        $this->product_id = $request->product_id;
        $this->date_entry = $request->date_entry;
    }
}
