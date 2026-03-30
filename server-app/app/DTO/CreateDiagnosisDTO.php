<?php

namespace App\DTO;


class CreateDiagnosisDTO
{
    public int $servi_id;
    public string $diagnosis;
    public string $repair_time;
    public int $cost;

    public function __construct($request)
    {
        if (is_array($request)) {
            $request = (object) $request;
        }

        $this->servi_id = $request->servi_id;
        $this->diagnosis = $request->diagnosis;
        $this->repair_time = $request->repair_time;
        $this->cost = $request->cost;
    }
}
