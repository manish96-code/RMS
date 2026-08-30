<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'menu_items';

    protected $fillable = [
        'restaurant_id',
        'category_id',
        'name',
        'description',
        'price',
        'image',
        'is_available',
    ];

    protected $casts = [
        'price' => 'float',
        'is_available' => 'boolean',
    ];

    protected $appends = ['image_url'];

    /**
     * Accessor for name attribute - ensures first letter is capitalized
     */
    public function getNameAttribute($value)
    {
        return $value ? ucfirst($value) : '';
    }

    /**
     * Mutator for name attribute - stores with first letter capitalized
     */
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value ? ucfirst(trim($value)) : '';
    }

    /**
     * Relationship: MenuItem belongs to a Restaurant
     */
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class, 'restaurant_id');
    }

    /**
     * Relationship: MenuItem belongs to a Category
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Accessor for full image URL
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }

        return url(Storage::url($this->image));
    }
}
