<?php

namespace App\Services;

use App\Models\Organization;
use Illuminate\Support\Facades\Auth;

class OrganizationContextService
{
    public function getActive(): ?Organization
    {
        $organizationId = session('organization_id');

        if (!$organizationId) {
            return null;
        }

        return Organization::find($organizationId);
    }

    public function setActive(int $organizationId): void
    {
        session([
            'organization_id' => $organizationId
        ]);
    }

    public function clear(): void
    {
        session()->forget('organization_id');
    }

    public function isActive(): bool
    {
        $organization = $this->getActive();

        return $organization && $organization->active;
    }
}