<?php

namespace App\Services;

use App\Enums\OrganizationStatus;
use App\Models\Organization;

class OrganizationContextService
{
    public function getActive(): ?Organization
    {
        $organizationId = session('tenant_id');

        if (! $organizationId) {
            return null;
        }

        return Organization::find($organizationId);
    }

    public function setActive(int $organizationId): void
    {
        session([
            'tenant_id' => $organizationId,
        ]);
    }

    public function clear(): void
    {
        session()->forget('tenant_id');
    }

    public function isActive(): bool
    {
        $organization = $this->getActive();

        return $organization && $organization->status === OrganizationStatus::Active;
    }
}
