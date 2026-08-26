<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $staffId = $this->route('id') ?? $this->route('staff');

        return [
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|max:100|unique:users,email,' . $staffId,
            'mobile' => ['sometimes', 'required', 'string', 'regex:/^[6-9][0-9]{9}$/'],
            'status' => 'sometimes|required|string|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'mobile.regex' => 'The mobile number must be a valid 10-digit number starting with 6, 7, 8, or 9.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors(),
        ], 422));
    }
}
