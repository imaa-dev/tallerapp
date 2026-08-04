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
    public function test_admin_is_redirected_dashboard_after_login(): void
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
            route('dashboard')
        );

        $this->assertAuthenticatedAs($user);
    }
}
