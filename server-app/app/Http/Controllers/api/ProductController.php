<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ProductService;
use Illuminate\Support\Facades\Log;
use App\DTO\api\CreateProductDTOAPI;

class ProductController extends Controller
{
    use ApiResponse;
    protected ProductService $productService;
    public function __construct( ProductService $productService ){
        $this->productService = $productService;
    }
    public function getProduct(Request $request){

        $organization_id = $request->user()->currentAccessToken()->organization_id;
        $product = $this->productService->getProducts($organization_id);
        return $this->success(
            $product,
            'Productos obtenidos correctamente',
            200
        );
    }

    public function createProduct(Request $request){
        $dto = new CreateProductDTOAPI($request);
        $product = $this->productService->createProductApi($dto);
        return $this->success(
            $product,
            "Producto creado satisfactoriamente",
            200
        );
    }
}
