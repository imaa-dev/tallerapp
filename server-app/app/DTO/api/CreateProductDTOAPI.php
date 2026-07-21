<?php
namespace App\DTO\api;

class CreateProductDTOAPI
{
    public ?array $files;
    public string $name;
    public string $brand;
    public string $model;
    public int $organization_id;

    public function __construct($request)
    {
        $this->files = $request->file('file') ?? null;
        $this->name  = $request->name;
        $this->brand = $request->brand;
        $this->model = $request->model;
        $this->organization_id = $request->user()->currentAccessToken()->organization_id;
    }
}
