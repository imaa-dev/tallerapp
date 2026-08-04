<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class AuthApiAppTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_user_can_login_complete_with_one_organization_with_valid_credentials(): void
    {
        $password = 'password';

        $user = User::factory()->admin()->create([
            'password' => bcrypt($password),
        ]);

        Organization::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => $password,
        ]);
        $response
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'token',
                'user',
            ]);
    }
}
