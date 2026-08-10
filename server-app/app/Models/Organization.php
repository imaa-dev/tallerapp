<?php

namespace App\Models;

use App\Enums\UsersRol;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\OrganizationStatus;
use Illuminate\Database\Eloquent\Relations\HasOne;


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
        'workshop_type_id',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'phone',
        'email',
        'website',
    ];
    public function file()
    {
        return $this->morphOne(File::class, 'fileable');
    }
    public function workshopType()
    {
        return $this->belongsTo(WorkshopType::class);
    }
    public function servis()
    {
        return $this->hasMany(Servi::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function services()
    {
        return $this->hasMany(Servi::class);
    }

    public function clients()
    {
        return $this->hasMany(User::class, 'created_by_organization_id', 'id')->where('rol', UsersRol::CLIENT);
    }
    public function technicians()
    {
        return $this->hasMany(User::class)->where('rol', UsersRol::TECHNICIAN);
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

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }
}
