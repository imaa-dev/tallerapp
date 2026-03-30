<?php

namespace App\Http\Controllers;

use App\Models\ServiceFiles;
use App\Services\ServiceFilesService;
use Illuminate\Http\Request;

class ServiceFileController extends Controller
{
    protected ServiceFilesService $serviceFilesService;

    public function __construct(ServiceFilesService $serviceFilesService)
    {
        $this->serviceFilesService = $serviceFilesService;
    }

    public function create()
    {
        
    }
}
