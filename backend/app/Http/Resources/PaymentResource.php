<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform payment into array payload.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payment_number' => $this->payment_number,
            'payment_method' => $this->payment_method,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'paid_at' => $this->paid_at ? $this->paid_at->toDateTimeString() : null,
            'paid_by' => [
                'id' => $this->paidBy ? $this->paidBy->id : null,
                'name' => $this->paidBy ? $this->paidBy->name : 'N/A',
            ],
            'order' => [
                'id' => $this->order ? $this->order->id : null,
                'order_number' => $this->order ? $this->order->order_number : null,
                'status' => $this->order ? $this->order->status : null,
                'table_number' => ($this->order && $this->order->table) ? $this->order->table->table_number : null,
            ],
        ];
    }
}
