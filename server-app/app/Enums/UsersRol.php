<?php

namespace App\Enums;

enum UsersRol: string
{
    case ADMIN = 'ADMIN';
    case TECHNICIAN = 'TECHNICIAN';

    case CLIENT = 'CLIENT';

    case SELLER = 'SELLER';
}
