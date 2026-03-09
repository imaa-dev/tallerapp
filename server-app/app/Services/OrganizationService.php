<?php

namespace App\Services;

use App\DAO\OrganizationDAO;
use App\DTO\CreateOrganizationDTO;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\DTO\ServiceResult;


class OrganizationService
{

    private OrganizationDAO $organizationDAO;
    public function __construct(OrganizationDAO $organizationDAO){
        $this->organizationDAO = $organizationDAO;
    }

    public function getAllByUser(int $id) : Collection
    {
        return $this->organizationDAO->getByUserId($id);
    }

    public function getActive(int $id)
    {
        return $this->organizationDAO->getActive($id);
    }

    public function getById(int $id)
    {
        return $this->organizationDAO->getById($id);
    }

public function create(array $data): ServiceResult
{
    try {
        $path = null;
        if (!empty($data['file'])) {
            $path = $data['file']->store(
                'organization/' . $data['user_id'],
                'public'
            );
        }

        $organization = $this->organizationDAO->createOrganization($data);
        if ($path) {
            $organization->file()->create([
                'path' => $path
            ]);
        }

        return new ServiceResult(
            true,
            201,
            'Organización creada satisfactoriamente',
            $organization
        );

    } catch (\Exception $e) {
        Log::error($e->getMessage());
        return new ServiceResult(
            false,
            500,
            $e->getMessage(),
            null
        );
    }
}


    public function update(CreateOrganizationDTO $data, $file): ServiceResult
    {
        try {
            $organization = $this->organizationDAO->getById($data->id);

            if (!$organization) {
                return new ServiceResult(false, 404, 'Organización no encontrada');
            }

            if ($file) {

                $path = $file->store('organization/' . $data->user_id, 'public');
                if ($organization->file) {
                    $organization->file()->delete();
                }
                if ($organization->file) {
                    Storage::disk('public')->delete($organization->file->path);
                }
            }

            $organizationUpdate = $this->organizationDAO->updateOrganization($organization, $data);
            if ($file) {
                $organization->file()->create([
                    'path' => $path
                ]);
            }

            return new ServiceResult(
                true,
                200,
                'Organización actualizada satisfactoriamente',
                $organizationUpdate
            );

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return new ServiceResult(
                false,
                500,
                $e->getMessage()
            );
        }
    }


    public function delete(int $id)
    {
        try {
            $organizationDelete = $this->organizationDAO->getById($id);
            if($organizationDelete->servis()->exists() ){
                return new ServiceResult(
                    false,
                    422,
                    'La organizacion tiene servicios asociados, no se puede eliminar'
                );
            }
            $this->organizationDAO->deleteOrganization($id);
            if($organizationDelete->file){
                $organizationDelete->file()->delete();
            }
            if($organizationDelete->file){
                Storage::disk('public')->delete($organizationDelete->file->path);
            }
            return new ServiceResult(
                 true,
                 200,
                 'Organización eliminada correctamente'
             );
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
           return new ServiceResult(
               false,
               500,
               'Error de server'
           );
        }
    }

    public function getByUserId(int $userId) 
    {
        return $this->organizationDAO->getByUserId($userId);
    }


}
