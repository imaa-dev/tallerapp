<?php
namespace App\DTO;

class UpdateProductDTO
{
    public int $id;
    public string $name;
    public string $brand;
    public string $model;

    public function __construct($request)
    {
        $this->id    = $request->id;
        $this->name  = $request->name;
        $this->brand = $request->brand;
        $this->model = $request->model;
    }
}
