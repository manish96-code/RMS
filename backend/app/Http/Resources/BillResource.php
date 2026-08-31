<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillResource extends JsonResource
{
    /**
     * Transform the order into a clean Bill data structure.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'created_at' => $this->created_at ? $this->created_at->toDateTimeString() : null,
            'restaurant' => [
                'id' => $this->restaurant ? $this->restaurant->id : null,
                'name' => $this->restaurant ? $this->restaurant->name : 'Restaurant',
                'address' => $this->restaurant ? $this->restaurant->address : null,
                'city' => $this->restaurant ? $this->restaurant->city : null,
                'state' => $this->restaurant ? $this->restaurant->state : null,
                'pincode' => $this->restaurant ? $this->restaurant->pincode : null,
                'phone' => $this->restaurant ? $this->restaurant->phone : null,
                'email' => $this->restaurant ? $this->restaurant->email : null,
                'gst_number' => $this->restaurant ? $this->restaurant->gst_number : null,
            ],
            'table' => [
                'id' => $this->table ? $this->table->id : null,
                'table_number' => $this->table ? $this->table->table_number : 'N/A',
                'capacity' => $this->table ? $this->table->capacity : null,
            ],
            'staff' => [
                'id' => $this->staff ? $this->staff->id : null,
                'name' => $this->staff ? $this->staff->name : 'Staff',
            ],
            'items' => $this->items ? $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->menuItem ? $item->menuItem->name : ($item->name ?? 'Item #' . $item->menu_item_id),
                    'quantity' => (int) $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) ($item->price * $item->quantity),
                    'notes' => $item->notes,
                ];
            }) : [],
            'subtotal' => (float) $this->subtotal,
            'tax' => (float) $this->tax,
            'discount' => (float) $this->discount,
            'total' => (float) $this->total,
            'is_paid' => $this->payment && $this->payment->status === 'paid',
            'payment' => $this->payment ? [
                'payment_number' => $this->payment->payment_number,
                'payment_method' => $this->payment->payment_method,
                'amount' => (float) $this->payment->amount,
                'status' => $this->payment->status,
                'paid_at' => $this->payment->paid_at ? $this->payment->paid_at->toDateTimeString() : null,
            ] : null,
        ];
    }
}
