<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TableResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'restaurant_id' => $this->restaurant_id,
            'table_number' => $this->table_number,
            'capacity' => (int) $this->capacity,
            'status' => $this->status,
            'is_available' => $this->status === 'available',
            'is_occupied' => $this->status === 'occupied',
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
