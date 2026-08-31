<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'restaurant_id',
        'order_id',
        'payment_number',
        'payment_method',
        'amount',
        'status',
        'paid_by',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'paid_at' => 'datetime',
    ];

    /**
     * Relationship: Payment belongs to a Restaurant
     */
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class, 'restaurant_id');
    }

    /**
     * Relationship: Payment belongs to an Order
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * Relationship: Payment belongs to User (paid_by)
     */
    public function paidBy()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }
}
