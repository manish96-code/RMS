<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $restaurant = $this->user()->restaurant;
        $restaurantId = $restaurant ? $restaurant->id : 0;

        return [
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) use ($restaurantId) {
                    return $query->where('restaurant_id', $restaurantId);
                }),
            ],
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:1000',
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_available' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' => 'The selected category does not belong to your restaurant.',
            'image.max' => 'The image size must not exceed 2MB.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
