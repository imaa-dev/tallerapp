<?php

namespace App\Services;

use App\DTO\CreateClientDTO;
use App\DTO\api\CreateClientDTOAPI;
use App\DTO\createTechnicianDTO;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;

class UserService
{
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
    public function createClientAPI(CreateClientDTOAPI $dto)
    {
        return User::create([
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

    public function getUserCreatedByOrganizationWithFile(
        int $organizationId,
        array $filters = []
    ): LengthAwarePaginator {

        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = $filters['per_page'] ?? 10;

        return User::query()
            ->where('created_by_organization_id', $organizationId)
            ->with('file')
            ->filter($filters)
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }
    public function listClientsByOrganization($id)
    {
        return User::where('created_by_organization_id', $id)->where('rol', 'CLIENT')->get();
    }

    // API

    public function authLogin(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
           throw new AuthenticationException('Credenciales incorrectas.');
        }

        $user->load('organizations');
        $organizations = $user->organizations;

        if ($organizations->count() === 1) {
            $organization = $organizations->first();
            return $this->createTokenForOrganization($user, $organization, $email);
        }

        if ($organizations->count() > 1) {
            return [
                'success' => false,
                'login_id' => $user->id . '_' . now()->timestamp,
                'user' => $user,
                'organizations' => $organizations->map(fn ($org) => [
                    'id' => $org->id,
                    'name' => $org->name,
                    'description' => $org->description,
                ]),
            ];
        }

        throw new AuthorizationException(
            'El usuario no pertenece a ninguna organización.'
        );
    }

    public function completeLogin(int $userId, int $organizationId): array
    {
        $user = User::findOrFail($userId);
        $user->load('organizations');

        $organization = $user->organizations->firstWhere('id', $organizationId);

        if (! $organization) {
            throw new AuthorizationException(
                'La organización no pertenece a este usuario.'
            );
        }

        return $this->createTokenForOrganization($user, $organization, $user->email);
    }

    public function createTokenForOrganization(User $user, $organization, string $email): array
    {
        $newToken = $user->createToken($email);
        $newToken->accessToken->organization_id = $organization->id;
        $newToken->accessToken->save();

        return [
            'success' => true,
            'token' => $newToken->plainTextToken,
            'user' => $user,
        ];
    }
}
