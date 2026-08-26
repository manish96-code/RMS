<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $restaurant = $this->user()->restaurant;
        $restaurantId = $restaurant ? $restaurant->id : 0;
        $categoryId = $this->route('category') ? (is_object($this->route('category')) ? $this->route('category')->id : $this->route('category')) : $this->route('id');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('categories')->where(function ($query) use ($restaurantId) {
                    return $query->where('restaurant_id', $restaurantId);
                })->ignore($categoryId),
            ],
            'description' => 'nullable|string|max:500',
            'status' => 'nullable|string|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'A category with this name already exists in your restaurant.',
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
