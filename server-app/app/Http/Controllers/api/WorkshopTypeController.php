<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\WorkshopType;

class WorkshopTypeController extends Controller
{
    public function index()
    {
        return response()->json(
            WorkshopType::select('id', 'name')->orderBy('id')->get()
        );
    }
}
