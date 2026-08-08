<?php

namespace App\Enums;

enum ServiceStatus: int
{
    case Reception = 1;
    case Diagnosis = 2;
    case SparePartApproval = 3;
    case CostApproval = 4;
    case InRepair = 5;
    case Repaired = 6;
    case Delivered = 7;
    case Incident = 8;

    public function previous(): ?ServiceStatus
    {
        return self::tryFrom($this->value - 1);
    }
}
