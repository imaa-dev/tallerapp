<?php

namespace App\Services;


use App\DAO\OrganizationDAO;
use App\DAO\UserDAO;
use App\DTO\CreateClientDTO;
use App\DTO\createTechnicianDTO;
use App\DTO\ServiceResult;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserService
{
    private UserDAO $userDAO;
    private OrganizationService $organizationService;

    public function __construct(UserDAO $userDAO, OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
        $this->userDAO = $userDAO;
    }

    public function createClient(CreateClientDTO $dto): ServiceResult
    {
        try {

            $organizationId = session('organization_id');
            if (!$organizationId) {
                return ServiceResult::fail("El usuario no tiene organización", 422);
            }

            $client = $this->userDAO->create([
                'created_by_organization_id' => $organizationId,
                'name' => $dto->name,
                'email' => $dto->email,
                'rol' => 'CLIENT',
                'phone' => $dto->phone
            ]);

            return new ServiceResult(
                true,
                201,
                'Cliente creado exitosamente',
                $client
            );

        } catch (\Throwable $e) {
            Log::error("Service User Error: ".$e->getMessage());

            return new ServiceResult(
                false,
                500,
                'Ocurrió un error al crear el cliente'
            );
        }
    }
    public function createTechnician(CreateTechnicianDTO $dto): ServiceResult
    {
            $organizationId = session('organization_id');
            if (!$organizationId) {
                return ServiceResult::fail("El usuario no tiene organización", 422);
            }

            $technician = $this->userDAO->create([
                'created_by_organization_id' => $organizationId,
                'name' => $dto->name,
                'email' => $dto->email,
                'rol' => 'TECHNICIAN',
                'phone' => $dto->phone,
                'password' => Hash ::make($dto->password)
            ]);
                
            return new ServiceResult(
                true,
                201,
                'Tecnico creado exitosamente',
                $technician
            );
    }
    public function update(array $data): ServiceResult
    {
        try {
            $client = $this->userDAO->updateClient($data);

            return new ServiceResult(
                true,
                200,
                'Cliente Actualizado Correctamente',
                 $client
            );

        } catch (\Throwable $th) {

            Log::error("Service User Catch Error: " . $th->getMessage());

            return new ServiceResult(
                 false,
                500,
                 'Error al actualizar el cliente'
            );
        }
    }


    public function deleteClient(int $id): ServiceResult
    {
        try {
            $client = $this->userDAO->getClientById($id);

            if(!$client){
                return new ServiceResult(
                    false,
                    404,
                    'Cliente no encontrado'
                );
            }

            if($client->servis()->count() > 0){
                return new ServiceResult(
                    false,
                    422,
                    'El cliente tiene servicios asociados, no se puede eliminar'
                );
            }

            $deleted = $this->userDAO->delete($id);

            if(!$deleted){
                return new ServiceResult(
                    false,
                    500,
                    'No se pudo eliimnar el producto'
                );
            }

            return new ServiceResult(
                 true,
                 204,
                 'Cliente eliminado correctamente'
            );

        } catch (\Throwable $th) {

            Log::error("Service User Catch Error: " . $th->getMessage());

            return new ServiceResult(
                false,
                 500,
                'Error al eliminar registro'
            );
        }
    }


    public function listClients($id)
    {
        return $this->userDAO->getByUserId($id);
    }

    public function getClientById($id)
    {
        return $this->userDAO->getClientById($id);
    }

    public function addTokenClient (User $client)
    {
        return $this->userDAO->addTokenAccessClient($client);
    }
    public function getUserCreatedByOrganizationWithFile(int $id){
        return $this->userDAO->getUserCreatedByOrganizationWithFile($id);
    }

    // API 

    public function authLoguin(string $email, string $password){
       
        $user = User::where('email', $email)->with('assignedOrganizations')->first();
        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas',
            ]);
        }
        $user->tokens()->delete();
        $token = $user->createToken($email)->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token,
            'organization_id' =>  $user->assignedOrganizations->first()?->id
        ]);
    }
}
