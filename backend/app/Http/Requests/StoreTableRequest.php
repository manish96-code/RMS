<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreTableRequest extends FormRequest
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
            'table_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('tables')->where(function ($query) use ($restaurantId) {
                    return $query->where('restaurant_id', $restaurantId);
                }),
            ],
            'capacity' => 'required|integer|min:1',
            'status' => 'nullable|string|in:available,occupied',
        ];
    }

    public function messages(): array
    {
        return [
            'table_number.unique' => 'A table with this number already exists in your restaurant.',
            'capacity.min' => 'Table capacity must be at least 1 person.',
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
