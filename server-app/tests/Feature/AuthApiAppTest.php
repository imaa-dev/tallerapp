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
                'requiresOrganization',
                'token',
                'user',
            ]);
    }

    public function test_user_with_multiple_organizations_can_complete_login(): void
    {
        $password = 'password';

        $user = User::factory()->admin()->create([
            'password' => bcrypt($password),
        ]);

        $organizationA = Organization::factory()->create([
            'user_id' => $user->id,
        ]);

        $organizationB = Organization::factory()->create([
            'user_id' => $user->id,
        ]);

        /*
         |----------------------------------------------------------
         | Paso 1: Login
         |----------------------------------------------------------
         */

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $loginResponse
            ->assertOk()
            ->assertJson([
                'success' => true,
                'requiresOrganization' => true,
            ])
            ->assertJsonStructure([
                'success',
                'requiresOrganization',
                'login_id',
                'organizations',
                'user',
            ]);

        $this->assertCount(
            2,
            $loginResponse->json('organizations')
        );

        $this->assertDatabaseHas('pending_logins', [
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);

        /*
         |----------------------------------------------------------
         | Paso 2: Usuario selecciona organización
         |----------------------------------------------------------
         */

        $loginId = $loginResponse->json('login_id');

        $completeResponse = $this->postJson('/api/auth/complete-login', [
            'login_id' => $loginId,
            'organization_id' => $organizationA->id,
        ]);

        $completeResponse
            ->assertOk()
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'token',
                'user',
            ]);

        /*
         |----------------------------------------------------------
         | Paso 3: Se creó el token con la organización elegida
         |----------------------------------------------------------
         */

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'organization_id' => $organizationA->id,
        ]);

        /*
         |----------------------------------------------------------
         | Paso 4: El pending login fue consumido
         |----------------------------------------------------------
         */

        $this->assertDatabaseMissing('pending_logins', [
            'token' => $loginId,
        ]);
    }
}
