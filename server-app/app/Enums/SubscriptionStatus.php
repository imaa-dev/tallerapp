<?php

namespace App\Enums;

enum SubscriptionStatus: string
{
    case Pending = 'pending';
    case Trial = 'trial';
    case Active = 'active';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
    case Suspected = 'suspected';
}
