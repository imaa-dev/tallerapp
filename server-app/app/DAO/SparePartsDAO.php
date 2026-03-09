<?php


namespace App\DAO;

use App\Models\SpareParts;

class SparePartsDAO
{
    public function createSparePart(array $data): SpareParts
    {
        return SpareParts::create($data);
    }

    public function deleteSparePart(int $id)
    {
        return SpareParts::destroy($id);
    }

    public function getAll()
    {
        return SpareParts::getAll();
    }

    public function update(int $id, array $data): SpareParts
    {
        $spare = SpareParts::findOrFail($id);
        $spare->update($data);
        return $spare;
    }

    public function getById(int $id): SpareParts
    {
        return SpareParts::findOrFail($id);
    }

}
