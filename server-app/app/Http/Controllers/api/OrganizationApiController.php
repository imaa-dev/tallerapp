<?php

namespace App\Http\Controllers\api;

use App\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\OrganizationService;
use Illuminate\Http\Request;

class OrganizationApiController extends Controller
{
    use ApiResponse;

    protected OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    public function show(Request $request)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;
        $organization = $this->organizationService->getById($organizationId);

        return $this->success($organization, 'Organizacion obtenida correctamente', 200);
    }

    public function update(Request $request)
    {
        $organizationId = $request->user()->currentAccessToken()->organization_id;

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
        ]);

        $organization = $this->organizationService->getById($organizationId);
        $organization->update($request->only([
            'name', 'description', 'email', 'phone', 'website',
            'address', 'city', 'state', 'country', 'postal_code',
        ]));

        return $this->success($organization, 'Organizacion actualizada correctamente', 200);
    }
}
