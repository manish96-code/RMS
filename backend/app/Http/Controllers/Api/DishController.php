<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dish;
use Illuminate\Http\Request;

class DishController extends Controller
{
    /**
     * Seed initial sample dishes if empty
     */
    private function seedInitialDishesIfEmpty()
    {
        if (Dish::count() === 0) {
            $sampleDishes = [
                [
                    'name' => 'Truffle Mushroom Pizza',
                    'category' => 'Pizzas & Burgers',
                    'price' => 480,
                    'rating' => 4.9,
                    'prep_time' => '18 mins',
                    'description' => 'Wood-fired sourdough pizza with wild mushrooms, truffle oil, and fresh mozzarella.',
                    'image' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
                    'in_stock' => true
                ],
                [
                    'name' => 'Grilled Butter Chicken Sizzler',
                    'category' => 'Main Course',
                    'price' => 520,
                    'rating' => 4.8,
                    'prep_time' => '22 mins',
                    'description' => 'Tender chicken marinated in aromatic spices served on a sizzling hot platter.',
                    'image' => 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500',
                    'in_stock' => true
                ],
                [
                    'name' => 'Artisanal Avocado Caesar Salad',
                    'category' => 'Starters',
                    'price' => 340,
                    'rating' => 4.7,
                    'prep_time' => '12 mins',
                    'description' => 'Crisp romaine lettuce, Hass avocado slice, garlic croutons, and creamy Caesar dressing.',
                    'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
                    'in_stock' => true
                ],
                [
                    'name' => 'Belgian Dark Chocolate Lava Cake',
                    'category' => 'Desserts',
                    'price' => 290,
                    'rating' => 4.95,
                    'prep_time' => '15 mins',
                    'description' => 'Warm molten chocolate cake served with Madagascar vanilla bean ice cream.',
                    'image' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500',
                    'in_stock' => true
                ],
                [
                    'name' => 'Sparkling Blueberry Mint Mocktail',
                    'category' => 'Beverages',
                    'price' => 220,
                    'rating' => 4.6,
                    'prep_time' => '8 mins',
                    'description' => 'Fresh muddled blueberries, wild mint leaves, lime juice, and sparkling soda.',
                    'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
                    'in_stock' => true
                ]
            ];

            foreach ($sampleDishes as $dishData) {
                Dish::create($dishData);
            }
        }
    }

    /**
     * GET /api/dishes
     */
    public function index()
    {
        $this->seedInitialDishesIfEmpty();

        $dishes = Dish::latest()->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Dishes fetched successfully',
            'count' => $dishes->count(),
            'dishes' => $dishes,
            'data' => $dishes,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * POST /api/admin/dishes or /api/dishes
     * Add dish API for Admin
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'category' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'prep_time' => 'nullable|string|max:30',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'rating' => 'nullable|numeric|min:1|max:5',
        ]);

        // Default placeholder images based on category if none provided
        $categoryImages = [
            'Starters' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
            'Main Course' => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
            'Pizzas & Burgers' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
            'Pizzas' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
            'Desserts' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500',
            'Beverages' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
        ];

        $image = !empty($validatedData['image'])
            ? $validatedData['image']
            : ($categoryImages[$validatedData['category']] ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500');

        $dish = Dish::create([
            'name' => $validatedData['name'],
            'category' => $validatedData['category'],
            'price' => $validatedData['price'],
            'rating' => $validatedData['rating'] ?? 4.8,
            'prep_time' => $validatedData['prep_time'] ?? '15 mins',
            'description' => $validatedData['description'] ?? 'Delicious fresh preparation by our top chef.',
            'image' => $image,
            'in_stock' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Dish added successfully for your restaurant!',
            'data' => $dish,
            'dish' => $dish,
        ], 201)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * Alias for store
     */
    public function createDish(Request $request)
    {
        return $this->store($request);
    }

    /**
     * GET /api/dishes/{id}
     */
    public function show($id)
    {
        $dish = Dish::find($id);

        if (!$dish) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dish not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        return response()->json([
            'status' => 'success',
            'data' => $dish,
            'dish' => $dish,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * PUT /api/dishes/{id}
     */
    public function update(Request $request, $id)
    {
        $dish = Dish::find($id);

        if (!$dish) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dish not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'category' => 'sometimes|required|string|max:50',
            'price' => 'sometimes|required|numeric|min:0',
            'prep_time' => 'nullable|string|max:30',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'in_stock' => 'nullable|boolean',
        ]);

        $dish->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Dish updated successfully',
            'data' => $dish,
            'dish' => $dish,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * DELETE /api/dishes/{id}
     */
    public function destroy($id)
    {
        $dish = Dish::find($id);

        if (!$dish) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dish not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $dish->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Dish deleted successfully',
            'id' => $id,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
