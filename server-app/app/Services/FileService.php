<?php

namespace App\Services;
use App\DAO\FileDAO;
use App\DTO\ServiceResult;
use App\DTO\ServiceResultFile;
use App\Models\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;
use Illuminate\Http\UploadedFile;


class FileService {

    private FileDAO $fileDAO;

    public function __construct(FileDAO $fileDAO)
    {
        $this->fileDAO = $fileDAO;
    }

    public function removeImage(int $id): ServiceResult
    {
        try {
            $file = $this->fileDAO->getById($id);
            Storage::disk('public')->delete($file->path);
            $this->fileDAO->remove($file);
            return new ServiceResult(
                true,
                200,
                'Imagen eliminada satisfactoriamente',
            );
        } catch(Throwable $th){
            Log::error($th);
            return new ServiceResult(
                false,
                500,
                'Error'
            );
        }
    }
    /**
     * @param UploadedFile[] $files
     */
    public function addImage(array $files, int $userId, int $serviceId): ServiceResultFile
    {
        // agregar metodo para dejar las imagenes con su color
        try {
            foreach ($files as $file){
                $path =  $file->store('servi/'.$userId, 'public');
                $this->fileDAO->create([
                    'path' => $path,
                    'fileable_type' => 'App\Models\Servi',
                    'fileable_id' => $serviceId
                ]);
            }
            $getFiles = File::where('fileable_id', $serviceId)->get();
            return new ServiceResultFile(
                true,
                200,
                'Imagen subida satisfactoriamente',
            $getFiles->toArray()
            );
        } catch (Throwable $th){
            Log::error($th->getMessage());
            return new ServiceResultFile(
                false,
                500,
                'ERROR'
            );
        }
    }
}
