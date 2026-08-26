<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'mobile',
        'phone',
        'password',
        'role',
        'status',
        'is_active',
        'shift',
        'orders_handled',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'orders_handled' => 'integer',
        ];
    }

    /**
     * Relationship: Admin hasOne Restaurant
     */
    public function restaurant()
    {
        return $this->hasOne(Restaurant::class, 'user_id');
    }

    /**
     * Mobile accessor fallback for phone attribute compatibility
     */
    public function getMobileAttribute($value)
    {
        return $value ?? $this->attributes['phone'] ?? '';
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return strtolower($this->role) === 'admin';
    }

    /**
     * Check if user is staff
     */
    public function isStaff(): bool
    {
        return strtolower($this->role) === 'staff';
    }

    /**
     * Check if user account is active
     */
    public function isActive(): bool
    {
        return strtolower($this->status) === 'active' && $this->is_active !== false;
    }
}
