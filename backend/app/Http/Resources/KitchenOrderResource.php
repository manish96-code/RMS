<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class KitchenOrderResource extends JsonResource
{
    /**
     * Transform the resource into an array for Kitchen API.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $createdAt = $this->created_at ? Carbon::parse($this->created_at) : Carbon::now();
        $now = Carbon::now();

        // Calculate elapsed minutes based on active stage
        $elapsedMinutes = 0;
        if ($this->status === 'pending') {
            $elapsedMinutes = (int) $createdAt->diffInMinutes($now);
        } elseif ($this->status === 'preparing') {
            $startTime = $this->preparing_at ? Carbon::parse($this->preparing_at) : $createdAt;
            $elapsedMinutes = (int) $startTime->diffInMinutes($now);
        } elseif ($this->status === 'ready') {
            $startTime = $this->ready_at ? Carbon::parse($this->ready_at) : $createdAt;
            $elapsedMinutes = (int) $startTime->diffInMinutes($now);
        }

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'table' => [
                'id' => $this->table ? $this->table->id : null,
                'table_number' => $this->table ? $this->table->table_number : 'N/A',
                'capacity' => $this->table ? $this->table->capacity : null,
            ],
            'staff' => [
                'id' => $this->staff ? $this->staff->id : null,
                'name' => $this->staff ? $this->staff->name : 'N/A',
            ],
            'items' => $this->items ? $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'menu_item_id' => $item->menu_item_id,
                    'name' => $item->menuItem ? $item->menuItem->name : ($item->name ?? 'Food Item #' . $item->menu_item_id),
                    'quantity' => (int) $item->quantity,
                    'notes' => $item->notes,
                ];
            }) : [],
            'notes' => $this->notes,
            'created_at' => $this->created_at ? $this->created_at->toDateTimeString() : null,
            'preparing_at' => $this->preparing_at ? $this->preparing_at->toDateTimeString() : null,
            'ready_at' => $this->ready_at ? $this->ready_at->toDateTimeString() : null,
            'served_at' => $this->served_at ? $this->served_at->toDateTimeString() : null,
            'elapsed_minutes' => $elapsedMinutes,
        ];
    }
}
