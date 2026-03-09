<?php

namespace App\DAO;

use App\Models\Diagnosis;

class DiagnosisDAO
{
    public function create(array $data): Diagnosis
    {
        return Diagnosis::create($data);
    }

    public function destroy(int $id)
    {
        return Diagnosis::destroy($id);
    }
}
