<?php
namespace App\Services;

use App\DAO\OrganizationDAO;
use App\DAO\ProductDAO;
use App\DTO\CreateProductDTO;
use App\DTO\api\CreateProductDTOAPI;
use App\DTO\ServiceResult;
use App\DTO\UpdateProductDTO;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ProductService{

    public function __construct(
        private OrganizationService $organizationService
    ) {}

    public function create(CreateProductDTO $dto)
    {
        $organization_id = session('tenant_id');
        $paths = [];
        if ($dto->files) {
            foreach ($dto->files as $file) {
                $paths[] = $file->store("product/".$dto->userId, "public");
            }
        }
        $product = Product::create([
            'organization_id' => $organization_id,
            'name'            => $dto->name,
            'brand'           => $dto->brand,
            'model'           => $dto->model
        ]);
        return $product;
    }
    public function createProductApi(CreateProductDTOAPI $dto)
    {
        $paths = [];
        if ($dto->files) {
            foreach ($dto->files as $file) {
                $paths[] = $file->store("product/".$dto->userId, "public");
            }
        }

        $product = Product::create([
            'organization_id' => $dto->organization_id,
            'name'            => $dto->name,
            'brand'           => $dto->brand,
            'model'           => $dto->model
        ]);
        return $product;
    }
    public function update(UpdateProductDTO $dto)
    {
        $product = Product::findOrFail($dto->id);
        $product->update([
            'name'  => $dto->name,
            'brand' => $dto->brand,
            'model' => $dto->model,
        ]);
        return $product;
    }

    public function delete(int $id): void
    {
        $product = Product::findOrFail($id);
        if ($product->servis()->count() > 0) {
            throw new ConflictHttpException('Este producto tiene servicio asociados no se puede eliminar');
        }
        $product->delete();
    }

    public function getProducts($organization_id)
    {
        return Product::where('organization_id', $organization_id)->get();
    }

    public function getProductById(int $id)
    {
        return Product::findOrFail($id);
    }

    public function getByOrganization(
        int $organizationId,
        array $filters = []
    )
    {
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = $filters['per_page'] ?? 10;

        return Product::query()
            ->where('organization_id', $organizationId)
            ->filter($filters)
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }
     public function getByOrganizationId(int $id)
    {
        return Product::where('organization_id', $id)->get();
    }
}
