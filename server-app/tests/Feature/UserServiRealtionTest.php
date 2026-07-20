<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Product;
use App\Models\StatusService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Servi;
use App\Enums\SubscriptionStatus;
use App\Models\Plan;
use App\Models\Subscription;
use Database\Seeders\PlanSeeder;
use Tests\TestCase;

class UserServiRealtionTest extends TestCase
{
	use RefreshDatabase;

    // flow admin create servi
	public function test_admin_can_create_servi_for_client()
	{
		$admin = User::factory()->admin()->create();
        $client = User::factory()->client()->create();
		$organization = Organization::factory()->create([
            'user_id' => $admin->id,
        ]);
        $product = Product::factory()->create([
            'organization_id' => $organization->id,
        ]);
        $status = StatusService::factory()->create();
		$servi = Servi::factory()->create([
			'user_id' => $client->id,
            'organization_id' => $organization->id,
            'product_id' => $product->id,
            'status_id' => $status->id,
            'date_entry' => now(),
		]);

		$this->assertDatabaseHas('servis', [
            'id' => $servi->id,
            'user_id' => $client->id,
        ]);
	}

    /*❌ Un CLIENT no puede crear un servi.*/


    public function test_client_can_not_create_servi()
    {
        $this->withoutMiddleware(
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class
        );

        // Seed de planes del sistema
        $this->seed(PlanSeeder::class);

        $client = User::factory()->client()->create([
            'email_verified_at' => now(),
        ]);

        $organization = Organization::factory()->create([
            'user_id' => $client->id,
        ]);

        $plan = Plan::where('name', 'Free')->first();

        $subscription = Subscription::factory()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => SubscriptionStatus::Active,
        ]);

        $product = Product::factory()->create([
            'organization_id' => $organization->id,
        ]);

        $status = StatusService::factory()->create();

        $response = $this->actingAs($client)
            ->withSession([
                'tenant_id' => $organization->id,
            ])
            ->post(route('services.store'), [
                'user_id' => $client->id,
                'organization_id' => $organization->id,
                'product_id' => $product->id,
                'status_id' => $status->id,
                'date_entry' => now()->toDateTimeString(),
                'reason_notes' => [
                    [
                        'reason_note' => 'Cliente reporta falla en frenos',
                    ]
                ],
            ]);

        $response->assertForbidden();

        $this->assertDatabaseMissing('servis', [
            'user_id' => $client->id,
        ]);
    }

    /*
    ❌ Un ADMIN no puede crear servi cuando la suscripción de la organización no está activa.
    */
    public function test_admin_can_not_create_servi_when_subscription_is_expired()
    {
        $this->withoutMiddleware(
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class
        );
        $admin = User::factory()->admin()->create();

        $organization = Organization::factory()->create([
            'user_id' => $admin->id,
        ]);

        $plan = Plan::where('name', 'Free')->first();

        Subscription::factory()->create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => SubscriptionStatus::Expired,
        ]);

        $product = Product::factory()->create([
            'organization_id' => $organization->id,
        ]);

        $status = StatusService::factory()->create();

        $response = $this->actingAs($admin)
            ->withSession([
                'tenant_id' => $organization->id,
            ])
            ->post(route('services.store'), [
                'user_id' => $admin->id,
                'organization_id' => $organization->id,
                'product_id' => $product->id,
                'status_id' => $status->id,
                'date_entry' => now()->toDateTimeString(),
                'reason_notes' => [
                    [
                        'reason_note' => 'Prueba',
                    ],
                ],
            ]);

        $response->assertStatus(302);

        $this->assertDatabaseMissing('servis', [
            'user_id' => $admin->id,
        ]);
    }

    /*
     * ❌ No puedes crear servi si el product no pertenece a esa organization.
    */

    public function test_can_not_create_servi_if_product_not_belongs_to_organization()
    {
        $this->withoutMiddleware(
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class
        );

        $admin = User::factory()->admin()->create();

        // Organization A (la que se enviará en el request)
        $organizationA = Organization::factory()->create([
            'user_id' => $admin->id,
        ]);

        // Organization B (donde realmente pertenece el producto)
        $organizationB = Organization::factory()->create([
            'user_id' => $admin->id,
        ]);

        $product = Product::factory()->create([
            'organization_id' => $organizationB->id,
        ]);

        $status = StatusService::factory()->create();

        $response = $this->actingAs($admin)
            ->withSession([
                'tenant_id' => $organizationA->id,
            ])
            ->post(route('services.store'), [
                'user_id' => $admin->id,
                'organization_id' => $organizationA->id, // ❌ diferente
                'product_id' => $product->id,            // pertenece a B
                'status_id' => $status->id,
                'date_entry' => now()->toDateTimeString(),
            ]);

        $response->assertStatus(302);

        $this->assertDatabaseMissing('servis', [
            'product_id' => $product->id,
        ]);
    }
/*
❌ No puedes crear servi con un status inexistente.

❌ No puedes crear servi si el client no pertenece a la organization.*/
/*
Admin puede crear organization ✔️

Client no puede crear organization ❌

Admin puede crear servi ✔️

Client no puede crear servi ❌

No se puede crear servi con organization inactiva ❌

No se puede usar un product de otra organization ❌*/
}
