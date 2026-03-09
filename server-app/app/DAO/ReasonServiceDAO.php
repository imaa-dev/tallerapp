<?php

namespace App\DAO;

use App\Models\Reason;
use Illuminate\Database\Eloquent\Collection;

class ReasonServiceDAO
{
    public function create(array $data): Reason
    {
        return Reason::create($data);
    }

    public function delete(int $id)
    {
        return Reason::destroy($id);
    }

    public function getByServiceId(int $id): Collection
    {
        return Reason::where('servi_id', $id)->get();
    }

    public function getById(int $id): Reason
    {
        return Reason::findOrFail($id);
    }

    public function addDiagnosisReason(Reason $reason, int $diagnosis_id): Reason
    {
        $reason->update([
            'diagnosis_id' => $diagnosis_id,
            'attend' => true
        ]);
        return $reason;
    }
}
