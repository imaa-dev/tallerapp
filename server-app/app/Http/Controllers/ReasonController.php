<?php

namespace App\Http\Controllers;

use App\Services\ReasonService;
use Illuminate\Http\Request;

class ReasonController extends Controller
{

    protected ReasonService $reasonService;

    public function __construct(ReasonService $reasonService)
    {
        $this->reasonService = $reasonService;
    }

    public function store(Request $request)
    {
        $res = $this->reasonService->store($request->reason, $request->service_id);
        return response()->json($res);
    }
    public function delete($id)
    {
        $res = $this->reasonService->removeReason($id);
        return response()->json($res);
    }
}
