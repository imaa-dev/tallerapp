<?php

namespace App\DAO;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserDAO
{
    public function create(array $data) : User
    {
        return User::create($data);
    }

    public function delete(int $id) : int
    {
        return User::destroy($id);
    }

    public function getByUserId(int $id) : Collection
    {
        return User::where('created_by_organization_id', $id)->where('rol', 'CLIENT')->get();
    }

    public function updateClient(array $data): User
    {
        $userClient = User::findOrFail($data['id']);
        $userClient->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone']
        ]);
        return $userClient;
    }
    public function getClientById($id) : User
    {
        return User::find($id);
    }

    public function addTokenAccessClient(User $client): User
    {
        $client->approval_token = Str::random(32);
        $client->token_expires_at = Carbon::now()->addHours(48);
        $client->save();
        return $client;
    }

    public function getUserCreatedByOrganizationWithFile(int $id)
    {
        return User::where('created_by_organization_id', $id)->with('file')->get();
    }
}
