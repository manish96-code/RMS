<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'restaurant_id' => $this->restaurant_id,
            'category_id' => $this->category_id,
            'category_name' => $this->category ? $this->category->name : null,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'image' => $this->image,
            'image_url' => $this->image_url,
            'is_available' => (bool) $this->is_available,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
