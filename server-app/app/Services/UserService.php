<?php

namespace App\Services;

use App\DTO\CreateClientDTO;
use App\DTO\api\CreateClientDTOAPI;
use App\DTO\createTechnicianDTO;
use App\DTO\ServiceResult;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserService
{
    private OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    public function createClient(CreateClientDTO $dto)
    {
        $organizationId = session('tenant_id');
        $client = User::create([
            'created_by_organization_id' => $organizationId,
            'name' => $dto->name,
            'email' => $dto->email,
            'rol' => 'CLIENT',
            'phone' => $dto->phone
        ]);
        return $client;
    }
    public function createClientAPI(CreateClientDTOAPI $dto): void
    {
        $client = User::create([
            'created_by_organization_id' => $dto->organization_id,
            'name' => $dto->name,
            'email' => $dto->email,
            'rol' => 'CLIENT',
            'phone' => $dto->phone
        ]);
    }
    public function createTechnician(CreateTechnicianDTO $dto): void
    {
        $organizationId = session('tenant_id');

        $technician = User::create([
            'created_by_organization_id' => $organizationId,
            'name' => $dto->name,
            'email' => $dto->email,
            'rol' => 'TECHNICIAN',
            'phone' => $dto->phone,
            'password' => Hash ::make($dto->password)
        ]);
    }
    public function update(array $data)
    {
        $user = User::findOrFail($data['id']);
        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone']
        ]);
        return $user;
    }


    public function deleteClient(int $id): void
    {
        $client = User::findOrFail($id);
        if($client->servis()->count() > 0){
            throw new ConflictHttpException('Este cliente tiene servicio asociados no se puede eliminar');
        }
        $client->delete();
    }


    public function listClients($id)
    {
        return User::where('created_by_organization_id', $id)->where('rol', 'CLIENT')->get();
    }

    public function getClientById($id)
    {
        return User::findOrFail($id);
    }

    public function addTokenClient (User $client)
    {
        $client->approval_token = Str::random(32);
        $client->token_expires_at = Carbon::now()->addHours(48);
        $client->save();
        return $client;
    }
    public function getUserCreatedByOrganizationWithFile(int $id){
        return User::where('created_by_organization_id', $id)->with('file')->get();
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
