<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * GET /api/settings
     * Fetch complete restaurant settings and tax configuration
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $restaurant = $user->restaurant ?: Restaurant::first();

        if (!$restaurant) {
            return response()->json([
                'success' => true,
                'message' => 'No restaurant settings configured yet',
                'data' => [
                    'restaurant' => null,
                    'tax' => ['enabled' => true, 'percentage' => 5.00],
                ],
            ], 200);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings fetched successfully',
            'data' => [
                'restaurant' => $restaurant,
                'tax' => [
                    'enabled' => (bool) $restaurant->tax_enabled,
                    'percentage' => (float) $restaurant->tax_percentage,
                ],
            ],
        ], 200);
    }

    /**
     * PUT /api/settings
     * Update restaurant profile and tax settings (Admin Authorized)
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:20',
            'gst_number' => 'nullable|string|max:50',
            'opening_time' => 'nullable|string',
            'closing_time' => 'nullable|string',
            'tax_enabled' => 'nullable|boolean',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Settings validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $restaurant = Restaurant::updateOrCreate(
            ['user_id' => $user->id],
            array_merge($validated, [
                'user_id' => $user->id,
                'tax_enabled' => $request->has('tax_enabled') ? (bool) $request->tax_enabled : true,
                'tax_percentage' => $request->has('tax_percentage') ? (float) $request->tax_percentage : 5.00,
            ])
        );

        return response()->json([
            'success' => true,
            'message' => 'Restaurant settings updated successfully',
            'data' => [
                'restaurant' => $restaurant->fresh(),
                'tax' => [
                    'enabled' => (bool) $restaurant->tax_enabled,
                    'percentage' => (float) $restaurant->tax_percentage,
                ],
            ],
        ], 200);
    }
}
