<?php

namespace App\Http\Controllers;

use App\Services\FileService;
use Illuminate\Http\Request;

class FileController extends Controller
{
    protected FileService $fileService ;
    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function removeImage($id)
    {
        $res = $this->fileService->removeImage($id);
        return response()->json($res);
    }

    public function uploadImage(Request $request)
    {
        $files = $request->file('file');
        $userId = $request->user()->id;
        $serviceId = $request->service_id;

        $res = $this->fileService->addImage($files, $userId, $serviceId);
        return response()->json($res);
    }
}
