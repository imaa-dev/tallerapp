<?php

namespace App\DTO;

class CreateSparePartsDTO
{
    public ?int $servi_id;
    public int $user_id;
    public string $model;
    public string $brand;
    public int $price;
    public string $note;

    public function __construct($request)
    {
        $this->servi_id = $request->service_id;
        $this->user_id = $request->user()->id;
        $this->model = $request->model;
        $this->brand = $request->brand;
        $this->price = $request->price;
        $this->note = $request->note;
    }
}
