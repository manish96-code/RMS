<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'restaurant_id',
        'name',
        'description',
        'status',
    ];

    /**
     * Relationship: Category belongs to a Restaurant
     */
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class, 'restaurant_id');
    }

    /**
     * Relationship: Category has many Menu Items
     */
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class, 'category_id');
    }
}
