<?php

namespace App\Enums;

enum OrganizationSubscriptionStatus: string
{

    case Trial = 'trial';
    case Active = 'active';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
    case Suspected = 'suspected';
}
