<?php
namespace App\DTO;

class CreateProductDTO 
{
    public ?array $files;
    public string $name;
    public string $brand;
    public string $model;
    public int $userId;

    public function __construct($request)
    {
        $this->files = $request->file('file') ?? null;
        $this->name  = $request->name;
        $this->brand = $request->brand;
        $this->model = $request->model;
        $this->userId = $request->user()->id;
    }
}
