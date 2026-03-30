<?php

namespace App\DAO;

use App\Models\ServiceFiles;

class ServiceFilesDAO{

    public function create(array $data): ServiceFiles
    {
        return ServiceFiles::create($data);
    }
}
