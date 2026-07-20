<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class AuthWebTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     */
    public function test_admin_is_redirected_to_organization_selection_after_login(): void
    {
        $this->withoutMiddleware(
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class
        );
        $password = 'password';

        $user = User::factory()->admin()->create([
            'password' => bcrypt($password),
        ]);

        Organization::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertRedirect(
            route('services.view')
        );

        $this->assertAuthenticatedAs($user);
    }

    public function test_admin_with_multiple_organizations_is_redirected_to_select_organization(): void
    {
        $this->withoutMiddleware(
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class
        );
        dump(config('database.default'));
        dump(config('database.connections.mysql.database'));
        $password = 'password';

        $user = User::factory()->admin()->create([
            'password' => bcrypt($password),
        ]);

        Organization::factory()->count(2)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertRedirect(
            route('select.organization')
        );

        $this->assertAuthenticatedAs($user);

        // Aún no debe existir una organización activa en la sesión
        $this->assertNull(session('tenant_id'));
    }
}
