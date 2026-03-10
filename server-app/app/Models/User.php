<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{

    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'created_by_user_id',
        'rol',
        'password',
        'phone',
        'role_id',
        'verification_code',
        'verification_code_expires_at',
        'approval_token',
        'token_expires_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'verification_code_expires_at' => 'datetime',
    ];
    public function file()
    {
        return $this->morphOne(File::class,  'fileable');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    public function plan()
    {
        return $this->hasOneThrough(Plan::class, Subscription::class);
    }

    public function servis()
    {
        return $this->hasMany(Servi::class);
    }
    
    public function organizations()
    {
        return $this->hasMany(Organization::class, 'user_id');
    }

    public function assignedOrganizations()
    {
        return $this->belongsToMany(
            Organization::class,
            'organization_users', 
            'user_id',           
            'organization_id'    
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
