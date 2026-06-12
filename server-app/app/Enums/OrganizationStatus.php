<?php

namespace App\Enums;

enum OrganizationStatus: string
{

    case Active = 'active';
    case Blocked = 'blocked';
    case Inactive = 'inactive';
}
