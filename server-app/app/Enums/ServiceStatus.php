<?php

namespace App\Enums;

enum ServiceStatus: int
{
    case Reception = 1;
    case Diagnosis = 2;
    case SparePartApproval = 3;
    case InRepair = 4;
    case Repaired = 5;
    case Delivered = 6;
    case Incident = 7;

    public function previous(): ?ServiceStatus
    {
        return self::tryFrom($this->value - 1);
    }
}
