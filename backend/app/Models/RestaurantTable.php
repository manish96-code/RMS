<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestaurantTable extends Model
{
    use HasFactory;

    protected $table = 'restaurant_tables';

    protected $fillable = [
        'table_no',
        'capacity',
        'status',
        'guest_count',
        'order_id',
        'time_seated',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'guest_count' => 'integer',
    ];
}
