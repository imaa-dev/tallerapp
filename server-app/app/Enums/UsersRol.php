<?php

namespace App\Enums;

enum UsersRol: string
{
    case ADMIN = 'admin';
    case TECHNICIAN = 'technician';

    case CLIENT = 'client';

    case SELLER = 'seller';
}
