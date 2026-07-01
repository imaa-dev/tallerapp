<?php

namespace App\Services;

use App\Models\ServiceFiles;

class ServiceFilesService{
    

    public function create(array $data): ServiceFiles
    {
        return ServiceFile::create($data);
    }
}

