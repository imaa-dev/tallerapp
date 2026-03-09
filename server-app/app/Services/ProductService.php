<?php
namespace App\Services;

use App\DAO\OrganizationDAO;
use App\DAO\ProductDAO;
use App\DTO\CreateProductDTO;
use App\DTO\ServiceResult;
use App\DTO\UpdateProductDTO;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class ProductService{


      public function __construct(
          private ProductDAO $productDAO,
          private OrganizationService $organizationService
      ) {}

    public function create(CreateProductDTO $dto): ServiceResult
    {
        try {
            $organization = $this->organizationService->getActive($dto->userId);

            if (!$organization) {
                return ServiceResult::fail("El usuario no tiene organización", 422);
            }

            $paths = [];
            if ($dto->files) {
                foreach ($dto->files as $file) {
                    $paths[] = $file->store("product/".$dto->userId, "public");
                }
            }

            $product = $this->productDAO->createProduct([
                'organization_id' => $organization->id,
                'name'            => $dto->name,
                'brand'           => $dto->brand,
                'model'           => $dto->model
            ]);

            return ServiceResult::success(
                 [ "product" => $product, "paths" => $paths ],
                 "Producto creado correctamente",
                 201
            );

        } catch (\Throwable $e) {
            Log::error($e);
            return ServiceResult::fail("Error interno del servidor", 500);
        }
    }

    public function update(UpdateProductDTO $dto): ServiceResult
    {
        try {
            $product = $this->productDAO->getById($dto->id);

            if (!$product) {
                return ServiceResult::fail("El producto no existe", 404);
            }

            $this->productDAO->updateProduct($product, [
                'name'  => $dto->name,
                'brand' => $dto->brand,
                'model' => $dto->model,
            ]);

            return ServiceResult::success(
                 $product,
                'Producto actualizado correctamente',
               200
            );

        } catch (\Throwable $e) {
            Log::error($e);

            return ServiceResult::fail(
                "Error al actualizar producto",
                500
            );
        }
    }

public function delete(int $id): ServiceResult
    {
        try {
            $product = $this->productDAO->getById($id);

            if (!$product) {
                return new ServiceResult(
                    false,
                    404,
                    'Producto no encontrado'
                );
            }

            if ($product->servis()->count() > 0) {
                return new ServiceResult(
                    false,
                    422,
                    'Este producto tiene servicios asociados y no puede ser eliminado.'
                );
            }

            $deleted = $this->productDAO->delete($id);

            if (!$deleted) {
                return new ServiceResult(
                    false,
                    500,
                    'No se pudo eliminar el producto'
                );
            }

            return new ServiceResult(
                true,
                200,
                'Producto eliminado correctamente'
            );

        } catch (\Throwable $e) {
            Log::error($e->getMessage());

            return new ServiceResult(
                false,
                500,
                'Ocurrió un error al eliminar el producto'
            );
        }
    }

    public function getProducts(): ServiceResult
    {
        try {
            $products = $this->productDAO->getAll();

            return new ServiceResult(
                true,
                200,
                'Productos obtenidos correctamente',
                $products
            );

        } catch (\Throwable $e) {
            Log::error($e->getMessage());

            return new ServiceResult(
                false,
                500,
                'Ocurrió un error al obtener los productos'
            );
        }
    }

    public function getProductById(int $id)
    {
        return $this->productDAO->getById($id);
    }

    public function getByOrganization(int $id)
    {
        return $this->productDAO->getByOrganization($id);
    }
}
