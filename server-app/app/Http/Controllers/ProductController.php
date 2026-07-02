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
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function list(Request $request){
        $products = [];
        $organizationId = session('tenant_id');
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
                'pagination' => null,
                'filters' => [],
                'message' => $message,
                'user_rol' => $user->rol,
            ]);

        }

        $filters = $request->only([
            'search',
            'brand',
            'model',
            'sort',
            'direction',
            'page',
            'per_page',
        ]);

        $products = $this->productService->getByOrganization($organizationId, $filters);
        return Inertia::render('product/product', [
            'notOrganization' => false,

            'products' => $products->items(),

            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
                'from'         => $products->firstItem(),
                'to'           => $products->lastItem(),
            ],

            'filters' => $filters,

            'message' => null,
            'user_rol' => $user->rol,
        ]);
    }
    public function filterProducts(Request $request): JsonResponse
    {
        $organizationId = session('tenant_id');

        $filters = $request->only([
            'search',
            'brand',
            'model',
            'sort',
            'direction',
            'page',
            'per_page',
        ]);

        $products = $this->productService->getByOrganization(
            $organizationId,
            $filters
        );

        return response()->json([
            'success' => true,

            'products' => $products->items(),

            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
                'from'         => $products->firstItem(),
                'to'           => $products->lastItem(),
            ],
        ]);
    }

    public function create(){
        return Inertia::render('product/createProduct');
    }

    public function store(StoreProductRequest $request)
    {
        $dto = new CreateProductDTO($request);
        $product = $this->productService->create($dto);
        return response()->json([
            'success' => true,
            'message' => 'Producto creado satisfactoriamente',
            'product'    => $product
        ]);
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
        $this->productService->update($dto);
        return redirect()->route('products.list.view')
            ->with('message', 'Producto actualizado satisfactoriamente');
    }

    public function delete($id)
    {
        $this->productService->delete($id);
        return response()->json([
            'success' => true,
            'message' => 'Producto eliminado satisfactoriamente',
        ]);
    }

    public function get()
    {
        $product = $this->productService->getProducts();
        return response()->json([
            'success' => true,
            'message' => 'Producto obtenido satisfactoriamente',
            'data'    => $product,
        ]);
    }
}
