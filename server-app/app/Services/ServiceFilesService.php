<?php

namespace App\Services;

use App\DAO\ServiceFilesDAO;
use App\Models\ServiceFiles;

class ServiceFilesService{
    
    private ServiceFilesDAO $serviceFilesDAO;

    public function __construct(ServiceFilesDAO $serviceFilesDAO)
    {
        $this->serviceFilesDAO = $serviceFilesDAO;
    }

    public function create(array $data): ServiceFiles
    {
        return $this->serviceFilesDAO->create($data);
    }
}

