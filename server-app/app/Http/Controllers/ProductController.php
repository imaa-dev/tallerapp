<?php

namespace App\Http\Controllers;

use App\DTO\UpdateProductDTO;
use App\Http\Requests\StoreProductRequest;
use App\Models\Organization;
use App\Models\Product;
use App\DTO\CreateProductDTO;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function list(Request $request){
        $products = [];
        $organizationId = session('organization_id');
        $user = $request->user();
        if(!$organizationId){
            $message = '';

            if ($user->rol === 'ADMIN') {
                $message = 'No tienes una organización creada. Debes crear una organización para comenzar.';
            }

            if ($user->rol === 'TECHNICIAN') {
                $message = 'No tienes una organización asignada. Contacta a un administrador.';
            }

            return Inertia::render('product/product', [
                'notOrganization' => true,
                'products' => [],
                'message' => $message,
                'user' => $user->rol
            ]);
            
        }
        return Inertia::render('product/product', [
            'notOrganization' => false,
            'products' => $products,
            'message' => null,
            'user_rol' => $user->rol
        ]);
    }

    public function create(){
        return Inertia::render('product/createProduct');
    }

    public function store(StoreProductRequest $request)
    {
        $dto = new CreateProductDTO($request);
        $res = $this->productService->create($dto);

        return response()->json([
            'success' => $res->success,
            'code'    => $res->code,
            'message' => $res->message,
            'data'    => $res->data
        ], $res->code);
    }
    public function getUpdate(Product $product)
    {
        $productFile = $this->productService->getProductById($product->id);
        return Inertia::render('product/editProduct', [
            'product' => $productFile
        ]);
    }
    public function update(StoreProductRequest $request)
    {
        $dto = new UpdateProductDTO($request);
        $res = $this->productService->update($dto);
        session()->flash('message', $res->message);
        return redirect()->route('products.list.view');
    }

    public function delete($id)
    {
        $result = $this->productService->delete($id);
        return response()->json([
            'success' => $result->success,
            'message' => $result->message,
            'code'    => $result->code,
        ]);
    }

    public function get()
    {
        $result = $this->productService->getProducts();
        return response()->json([
            'success' => $result->success,
            'message' => $result->message,
            'code'    => $result->code,
            'data'    => $result->data,
        ]);
    }
}
