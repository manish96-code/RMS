<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MenuItemController extends Controller
{
    /**
     * Helper to get authenticated user's restaurant ID
     */
    private function getRestaurantId(Request $request)
    {
        $user = $request->user();
        if ($user->restaurant) {
            return $user->restaurant->id;
        }

        // For Staff users, link to the system's restaurant
        if ($user->isStaff()) {
            $restaurant = Restaurant::first();
            return $restaurant ? $restaurant->id : null;
        }

        return null;
    }

    /**
     * GET /api/menu-items
     */
    public function index(Request $request)
    {
        $restaurantId = $this->getRestaurantId($request);

        if (!$restaurantId) {
            return response()->json([
                'success' => true,
                'message' => 'No restaurant configured yet',
                'data' => [],
            ], 200);
        }

        $query = MenuItem::where('restaurant_id', $restaurantId)->with('category');

        // Optional filter: category_id
        if ($request->has('category_id') && !empty($request->category_id)) {
            $query->where('category_id', $request->category_id);
        }

        // Optional filter: is_available
        if ($request->has('is_available') && $request->is_available !== null && $request->is_available !== '') {
            $isAvailable = filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_available', $isAvailable);
        }

        // Optional filter: search (name or description)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $menuItems = $query->orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Menu items fetched successfully',
            'data' => MenuItemResource::collection($menuItems),
        ], 200);
    }

    /**
     * POST /api/menu-items
     */
    public function store(StoreMenuItemRequest $request)
    {
        $restaurantId = $this->getRestaurantId($request);

        if (!$restaurantId) {
            return response()->json([
                'success' => false,
                'message' => 'Please set up your restaurant before creating menu items.',
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('menu_items', 'public');
        }

        $menuItem = MenuItem::create([
            'restaurant_id' => $restaurantId,
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image' => $imagePath,
            'is_available' => $request->has('is_available') ? filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN) : true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Menu item created successfully',
            'data' => new MenuItemResource($menuItem->load('category')),
        ], 201);
    }

    /**
     * GET /api/menu-items/{id}
     */
    public function show(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $menuItem = MenuItem::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with('category')
            ->first();

        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menu item retrieved successfully',
            'data' => new MenuItemResource($menuItem),
        ], 200);
    }

    /**
     * PUT /api/menu-items/{id}
     */
    public function update(UpdateMenuItemRequest $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $menuItem = MenuItem::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        $updateData = $request->only(['category_id', 'name', 'description', 'price']);

        if ($request->has('is_available')) {
            $updateData['is_available'] = filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN);
        }

        // Handle Image upload if new file provided
        if ($request->hasFile('image')) {
            if ($menuItem->image && Storage::disk('public')->exists($menuItem->image)) {
                Storage::disk('public')->delete($menuItem->image);
            }
            $updateData['image'] = $request->file('image')->store('menu_items', 'public');
        }

        $menuItem->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Menu item updated successfully',
            'data' => new MenuItemResource($menuItem->fresh('category')),
        ], 200);
    }

    /**
     * DELETE /api/menu-items/{id}
     */
    public function destroy(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $menuItem = MenuItem::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        if ($menuItem->image && Storage::disk('public')->exists($menuItem->image)) {
            Storage::disk('public')->delete($menuItem->image);
        }

        $menuItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu item deleted successfully',
        ], 200);
    }

    /**
     * PATCH /api/menu-items/{id}/availability
     */
    public function updateAvailability(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'is_available' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $restaurantId = $this->getRestaurantId($request);

        $menuItem = MenuItem::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$menuItem) {
            return response()->json([
                'success' => false,
                'message' => 'Menu item not found',
            ], 404);
        }

        $menuItem->update([
            'is_available' => filter_var($request->is_available, FILTER_VALIDATE_BOOLEAN),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Menu item availability updated successfully',
            'data' => new MenuItemResource($menuItem->fresh('category')),
        ], 200);
    }
}
