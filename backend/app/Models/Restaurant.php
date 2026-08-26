<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Restaurant extends Model
{
    use HasFactory;

    protected $table = 'restaurants';

    protected $fillable = [
        'user_id',
        'name',
        'logo',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'pincode',
        'gst_number',
        'opening_time',
        'closing_time',
        'status',
    ];

    protected $appends = ['logo_url'];

    /**
     * Relationship: Restaurant belongs to Admin User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Accessor for full logo URL
     */
    public function getLogoUrlAttribute()
    {
        if (!$this->logo) {
            return null;
        }

        if (filter_var($this->logo, FILTER_VALIDATE_URL)) {
            return $this->logo;
        }

        return url(Storage::url($this->logo));
    }
}
