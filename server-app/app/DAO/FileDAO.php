<?php

namespace App\DAO;

use App\Models\File;

class FileDAO
{

    public function create(array $data): File
    {
        return File::create($data);
    }
    public function getById(int $id): ?File
    {
        return File::findOrFail($id);
    }

    public function remove(File $file)
    {
        return $file->delete();
    }

    public function getByFileableId(int $id): File
    {
        // generar consulta propia usando where
        return File::where('fileable_id', $id)->first;
    }
}
