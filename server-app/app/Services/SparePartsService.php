<?php

namespace App\Services;

use App\DTO\CreateSparePartsDTO;
use App\Models\SpareParts;

class SparePartsService
{
    public function createSparePart(CreateSparePartsDTO $data)
    {
        $spare_part = SpareParts::create([
            'servi_id' => $data->servi_id,
            'user_id' => $data->user_id,
            'organization_id' => session('tenant_id'),
            'model' => $data->model,
            'brand' => $data->brand,
            'price' => $data->price,
            'note' => $data->note,
        ]);

        return $spare_part;
    }

    public function update(int $id, array $data)
    {
        $spare_part = SpareParts::findOrfail($id);

        $allowed = ['servi_id', 'user_id', 'model', 'brand', 'price', 'note'];
        $data = array_intersect_key($data, array_flip($allowed));
        $spare_part->update($data);

        return $spare_part;
    }

    public function delete($id): void
    {
        SpareParts::destroy($id);
    }

    public function sparePartNotificate(int $service_id, array $spare_parts)
    {
        foreach ($spare_parts as $spare_part) {

            $this->update($spare_part, ['servi_id' => $service_id]);
        }
    }

    public function getSpareParts(int $organization_id)
    {
        return SpareParts::where('organization_id', $organization_id)->get();
    }

    public function getByOrganization(int $organizationId, array $filters = [])
    {
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = $filters['per_page'] ?? 10;

        return SpareParts::query()
            ->byOrganization($organizationId)
            ->filter($filters)
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }
}
