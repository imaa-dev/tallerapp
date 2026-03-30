<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizationUser extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'organization_id',
        'user_id'
    ];
}
