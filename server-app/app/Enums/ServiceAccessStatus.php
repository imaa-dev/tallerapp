<?php

namespace App\Enums;

enum ServiceAccessStatus: string
{
    case RepairStart = 'repair_start';
    case CostApproval = 'cost_approval';
    case FinalRepair = 'final_repair';
}
