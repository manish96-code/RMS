<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RestaurantController extends Controller
{
    /**
     * GET /api/restaurant
     */
    public function show(Request $request)
    {
        $restaurant = $request->user()->restaurant;

        if (!$restaurant) {
            return response()->json([
                'success' => true,
                'message' => 'No restaurant configured yet',
                'data' => null,
            ], 200);
        }

        return response()->json([
            'success' => true,
            'message' => 'Restaurant fetched successfully',
            'data' => $restaurant,
        ], 200);
    }

    /**
     * POST /api/restaurant
     */
    public function store(StoreRestaurantRequest $request)
    {
        $user = $request->user();

        // Ensure user_id is enforced from authenticated user
        $restaurantData = array_merge($request->validated(), [
            'user_id' => $user->id,
            'status' => $request->status ?? 'active',
        ]);

        $restaurant = Restaurant::updateOrCreate(
            ['user_id' => $user->id],
            $restaurantData
        );

        return response()->json([
            'success' => true,
            'message' => 'Restaurant setup completed successfully',
            'data' => $restaurant,
        ], 201);
    }

    /**
     * PUT /api/restaurant
     */
    public function update(UpdateRestaurantRequest $request)
    {
        $user = $request->user();
        $restaurant = $user->restaurant;

        if (!$restaurant) {
            // Create if doesn't exist
            $restaurantData = array_merge($request->validated(), [
                'user_id' => $user->id,
                'status' => $request->status ?? 'active',
            ]);
            $restaurant = Restaurant::create($restaurantData);

            return response()->json([
                'success' => true,
                'message' => 'Restaurant created successfully',
                'data' => $restaurant,
            ], 201);
        }

        // Prevent modification of id, user_id, created_at
        $updateData = $request->except(['id', 'user_id', 'created_at']);
        $restaurant->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Restaurant updated successfully',
            'data' => $restaurant->fresh(),
        ], 200);
    }

    /**
     * POST /api/restaurant/logo
     */
    public function uploadLogo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'logo.required' => 'Please select an image file to upload.',
            'logo.image' => 'The file must be a valid image.',
            'logo.mimes' => 'The logo must be a file of type: jpg, jpeg, png, webp.',
            'logo.max' => 'The logo size must not exceed 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $restaurant = $user->restaurant;

        if (!$restaurant) {
            return response()->json([
                'success' => false,
                'message' => 'Restaurant profile must be created before uploading a logo.',
            ], 404);
        }

        // Delete old logo file if exists in local storage
        if ($restaurant->logo && Storage::disk('public')->exists($restaurant->logo)) {
            Storage::disk('public')->delete($restaurant->logo);
        }

        // Store new logo
        $logoPath = $request->file('logo')->store('logos', 'public');
        $restaurant->update(['logo' => $logoPath]);

        return response()->json([
            'success' => true,
            'message' => 'Restaurant logo uploaded successfully',
            'data' => $restaurant->fresh(),
        ], 200);
    }
}
