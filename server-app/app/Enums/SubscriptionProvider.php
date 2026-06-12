<?php

namespace App\Enums;

enum SubscriptionProvider: string
{
    case PAYPAL = 'paypal';
    case TRANSBANK = 'transbank';
    case MERCADOPAGO = 'mercadoPago';
}
