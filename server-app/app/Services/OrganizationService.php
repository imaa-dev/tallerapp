<?php

namespace App\Services;

use App\DTO\CreateOrganizationDTO;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\DTO\ServiceResult;
use App\Services\OrganizationContextService;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class OrganizationService
{

    private OrganizationContextService $organizationContext;

    public function __construct(OrganizationContextService $organizationContext){
        $this->organizationContext = $organizationContext;
    }

    public function getAllByUser(int $id) : Collection
    {
        return Organization::where('user_id', $id)->with('file')->get();
    }

    public function getById(int $id)
    {
        return Organization::with('file')->findOrFail($id);
    }

    public function create(array $data)
    {
        // agregar DB::transaction por la cantidad de acciones que ocurren en el servicio
        $path = null;
        if (!empty($data['file'])) {
            $path = $data['file']->store(
                'organization/' . $data['user_id'],
                'public'
            );
        }

        $organization = Organization::create($data);
        if ($path) {
            $organization->file()->create([
                'path' => $path
            ]);
        }

        return $organization;
    }

    public function update(CreateOrganizationDTO $data, $file)
    {
   
        $organization = Organization::with('file')->findOrFail($data->id);
        if ($file) {

            $path = $file->store('organization/' . $data->user_id, 'public');
            if ($organization->file) {
                $organization->file()->delete();
            }
            if ($organization->file) {
                Storage::disk('public')->delete($organization->file->path);
            }
        }

        $organization->update([
            'user_id' => $data->user_id,
            'name' => $data->name,
            'description' =>  $data->description,
        ]);
    
        if ($file) {
            $organization->file()->create([
                'path' => $path
            ]);
        }
    }


    public function delete(int $id)
    {
        $organizationDelete = Organization::with('file')->findOrFail($id);
        if($organizationDelete->servis()->exists() ){
            throw new ConflictHttpException('La organizacion tiene servicio asociados no se puede eliminar');
        }
        $this->organizationDAO->deleteOrganization($id);
        if($organizationDelete->file){
            $organizationDelete->file()->delete();
        }
        if($organizationDelete->file){
            Storage::disk('public')->delete($organizationDelete->file->path);
        }
    }

    public function getByUserId(int $user_id)
    {
        return Organization::where('user_id', $user_id)->with('file')->get();
    }

    public function getByUserIdWithSubscription(int $user_id)
    {
        return Organization::where('user_id', $user_id)->with('file')->with('subscription')->get();
    }

    public function getOrganizationById(int $organizationId): Organization
    {
        return Organization::findOrFail($organizationId);
    }

}
