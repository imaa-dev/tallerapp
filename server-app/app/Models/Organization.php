<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\OrganizationStatus;


/**
 * @method static \Illuminate\Database\Eloquent\Builder|Organization create(array $attributes = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Organization find($id, $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|Organization where($column, $operator = null, $value = null, $boolean = 'and')
 */
class Organization extends Model
{
    use HasFactory;

    protected $casts = [
        'status' => OrganizationStatus::class,
    ];

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status'
    ];
    public function file()
    {
        return $this->morphOne(File::class, 'fileable');
    }
    public function servis()
    {
        return $this->hasMany(Servi::class);
    }

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'organization_users',
            'organization_id',
            'user_id'
        );
    }
}
