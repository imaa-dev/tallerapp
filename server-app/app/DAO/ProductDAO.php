<?php

namespace App\DAO;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductDAO
{
    public function createProduct(array $data): Product
    {
        return Product::create([
            'organization_id' => $data['organization_id'],
            'name' => $data['name'],
            'brand' => $data['brand'],
            'model' => $data['model'],
        ]);
    }

    public function getById(int $id)
    {
        return Product::findOrFail($id);
    }

    public function updateProduct(Product $product, array $data): Product
    {
        $product->update([
            'name'  => $data['name'],
            'brand' => $data['brand'],
            'model' => $data['model']
        ]);

        return $product;
    }

    public function delete(int $id)
    {
        return Product::destroy($id);
    }

    public function getAll()
    {
        return Product::all();
    }

    public function getByOrganization(int $id): Collection
    {
        return Product::where('organization_id', $id)->get();
    }
}
