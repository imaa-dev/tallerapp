<?php

namespace App\Services;

use App\DTO\CreateClientDTO;
use App\DTO\api\CreateClientDTOAPI;
use App\DTO\createTechnicianDTO;
use App\DTO\ServiceResult;
use App\Models\User;
use App\Models\PendingLogin;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

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

        if ($organizations->count() > 1) {
            $pendingLogin = PendingLogin::create([
                'user_id' => $user->id,
                'token' => Str::random(32),
                'expires_at' => Carbon::now()->addMinutes(10),
            ]);
            return [
                'success' => true,
                'requiresOrganization' => true,
                'login_id' => $pendingLogin->token,
                'organizations' => $organizations,
                'user' => $user,
            ];
        }

        if ($organizations->count() === 1) {

            $organization = $organizations->first();

            $newToken = $user->createToken($email);

            $newToken->accessToken->organization_id = $organization->id;
            $newToken->accessToken->save();

            return [
                'success' => true,
                'requiresOrganization' => false,
                'token' => $newToken->plainTextToken,
                'user' => $user,
            ];
        }

        throw new AuthorizationException(
            'El usuario no pertenece a ninguna organización.'
        );
    }

    public function completeLogin(string $login_id, int $organizationId): array
    {
        $pendingLogin = PendingLogin::where('token', $login_id)->first();

        if (! $pendingLogin) {
            throw new AuthorizationException(
                'El token de inicio de sesión no es válido.'
            );
        }

        $user = $pendingLogin->user;

        $organization = $this->organizationService->getOrganizationById($organizationId);

        if (! $user->organizations->contains($organization)) {
            throw new AuthorizationException(
                'El usuario no pertenece a la organización seleccionada.'
            );
        }

        $newToken = $user->createToken($user->email);

        $newToken->accessToken->organization_id = $organization->id;
        $newToken->accessToken->save();
        $pendingLogin->delete();

        return [
            'success' => true,
            'token' => $newToken->plainTextToken,
            'user' => $user,
        ];
    }
}
