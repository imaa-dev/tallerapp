<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ServiController extends Controller
{

    protected ServiService $serviService;
    public function __construct(ServiService $serviService)
    {
        $this->serviService = $serviService;
    }
    public function listServices()
    {
        $coutTypeService = $this->serviService->getCountTypeService();
    }
}
