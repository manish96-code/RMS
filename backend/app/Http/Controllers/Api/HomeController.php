<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dish;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Fetch dishes from DB, or seed initial dishes if empty
        $dbDishes = Dish::latest()->get();

        if ($dbDishes->isEmpty()) {
            app(DishController::class)->index();
            $dbDishes = Dish::latest()->get();
        }

        // Fetch tables from DB, or seed initial tables if empty
        $dbTables = RestaurantTable::orderBy('id', 'asc')->get();

        if ($dbTables->isEmpty()) {
            app(TableController::class)->index();
            $dbTables = RestaurantTable::orderBy('id', 'asc')->get();
        }

        $restaurantInfo = [
            'name' => "Gourmet Haven Restaurant & Lounge",
            'tagline' => 'Fresh Flavors, Memorable Dining',
            'status' => 'Open & Serving',
            'opening_hours' => '10:00 AM - 11:00 PM',
            'address' => '124 Culinary Boulevard, Foodville',
            'phone' => '+1 (555) 234-5678',
        ];

        $stats = [
            'today_revenue' => 42850,
            'total_orders' => 38,
            'active_orders' => 12,
            'occupied_tables' => $dbTables->where('status', 'Occupied')->count(),
            'total_tables' => $dbTables->count(),
            'pending_kitchen' => 4,
            'active_dishes_count' => $dbDishes->count(),
        ];

        $categories = [
            ['id' => 1, 'name' => 'Starters', 'count' => $dbDishes->where('category', 'Starters')->count(), 'icon' => '🥗', 'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'],
            ['id' => 2, 'name' => 'Main Course', 'count' => $dbDishes->where('category', 'Main Course')->count(), 'icon' => '🍲', 'image' => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'],
            ['id' => 3, 'name' => 'Pizzas & Burgers', 'count' => $dbDishes->where('category', 'Pizzas & Burgers')->count(), 'icon' => '🍕', 'image' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'],
            ['id' => 4, 'name' => 'Desserts', 'count' => $dbDishes->where('category', 'Desserts')->count(), 'icon' => '🍰', 'image' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400'],
            ['id' => 5, 'name' => 'Beverages', 'count' => $dbDishes->where('category', 'Beverages')->count(), 'icon' => '🍹', 'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400'],
        ];

        $recentOrders = [
            ['id' => '#208', 'table' => 'T-06', 'customer' => 'Robert Fox', 'items' => '3x Truffle Pizza, 4x Mocktails', 'total' => 2320, 'status' => 'Preparing', 'time' => '5 mins ago'],
            ['id' => '#207', 'table' => 'T-01', 'customer' => 'Ananya Sharma', 'items' => '1x Butter Chicken, 2x Naan', 'total' => 680, 'status' => 'Served', 'time' => '18 mins ago'],
            ['id' => '#206', 'table' => 'T-03', 'customer' => 'David Miller', 'items' => '2x Lava Cake, 1x Espresso', 'total' => 740, 'status' => 'Ready', 'time' => '22 mins ago'],
            ['id' => '#205', 'table' => 'Takeaway', 'customer' => 'Sophia Chen', 'items' => '2x Caesar Salad', 'total' => 680, 'status' => 'Paid & Completed', 'time' => '35 mins ago'],
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Restaurant Homepage API loaded successfully',
            'restaurant' => $restaurantInfo,
            'stats' => $stats,
            'categories' => $categories,
            'featured_dishes' => $dbDishes,
            'tables' => $dbTables,
            'recent_orders' => $recentOrders,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
