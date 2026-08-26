<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class CategoryController extends Controller
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
     * GET /api/categories
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

        $categories = Category::where('restaurant_id', $restaurantId)
            ->withCount('menuItems')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Categories fetched successfully',
            'data' => CategoryResource::collection($categories),
        ], 200);
    }

    /**
     * POST /api/categories
     */
    public function store(StoreCategoryRequest $request)
    {
        $restaurantId = $this->getRestaurantId($request);

        if (!$restaurantId) {
            return response()->json([
                'success' => false,
                'message' => 'Please set up your restaurant before creating categories.',
            ], 422);
        }

        $category = Category::create([
            'restaurant_id' => $restaurantId,
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category),
        ], 201);
    }

    /**
     * GET /api/categories/{id}
     */
    public function show(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $category = Category::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Category retrieved successfully',
            'data' => new CategoryResource($category),
        ], 200);
    }

    /**
     * PUT /api/categories/{id}
     */
    public function update(UpdateCategoryRequest $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $category = Category::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $category->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category->fresh()),
        ], 200);
    }

    /**
     * DELETE /api/categories/{id}
     */
    public function destroy(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $category = Category::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        // Prevent deletion if category contains menu items (Requirement 11)
        if ($category->menuItems()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'This category contains menu items and cannot be deleted. Please move or delete the menu items first.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ], 200);
    }
}
