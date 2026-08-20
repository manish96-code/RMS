<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
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
            'occupied_tables' => 9,
            'total_tables' => 15,
            'pending_kitchen' => 4,
        ];

        $categories = [
            ['id' => 1, 'name' => 'Starters', 'count' => 14, 'icon' => '🥗', 'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'],
            ['id' => 2, 'name' => 'Main Course', 'count' => 22, 'icon' => '🍲', 'image' => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'],
            ['id' => 3, 'name' => 'Pizzas & Burgers', 'count' => 18, 'icon' => '🍕', 'image' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'],
            ['id' => 4, 'name' => 'Desserts', 'count' => 10, 'icon' => '🍰', 'image' => 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400'],
            ['id' => 5, 'name' => 'Beverages', 'count' => 15, 'icon' => '🍹', 'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400'],
        ];

        $featuredDishes = [
            [
                'id' => 101,
                'name' => 'Truffle Mushroom Pizza',
                'category' => 'Pizzas & Burgers',
                'price' => 480,
                'rating' => 4.9,
                'prep_time' => '18 mins',
                'description' => 'Wood-fired sourdough pizza with wild mushrooms, truffle oil, and fresh mozzarella.',
                'image' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
                'is_chef_special' => true,
                'in_stock' => true
            ],
            [
                'id' => 102,
                'name' => 'Grilled Butter Chicken Sizzler',
                'category' => 'Main Course',
                'price' => 520,
                'rating' => 4.8,
                'prep_time' => '22 mins',
                'description' => 'Tender chicken marinated in aromatic spices served on a sizzling hot platter.',
                'image' => 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500',
                'is_chef_special' => true,
                'in_stock' => true
            ],
            [
                'id' => 103,
                'name' => 'Artisanal Avocado Caesar Salad',
                'category' => 'Starters',
                'price' => 340,
                'rating' => 4.7,
                'prep_time' => '12 mins',
                'description' => 'Crisp romaine lettuce, Hass avocado slice, garlic croutons, and creamy Caesar dressing.',
                'image' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
                'is_chef_special' => false,
                'in_stock' => true
            ],
            [
                'id' => 104,
                'name' => 'Belgian Dark Chocolate Lava Cake',
                'category' => 'Desserts',
                'price' => 290,
                'rating' => 4.95,
                'prep_time' => '15 mins',
                'description' => 'Warm molten chocolate cake served with Madagascar vanilla bean ice cream.',
                'image' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500',
                'is_chef_special' => true,
                'in_stock' => true
            ],
            [
                'id' => 105,
                'name' => 'Sparkling Blueberry Mint Mocktail',
                'category' => 'Beverages',
                'price' => 220,
                'rating' => 4.6,
                'prep_time' => '8 mins',
                'description' => 'Fresh muddled blueberries, wild mint leaves, lime juice, and sparkling soda.',
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
                'is_chef_special' => false,
                'in_stock' => true
            ]
        ];

        $tablesOverview = [
            ['table_no' => 'T-01', 'capacity' => 2, 'status' => 'Occupied', 'guest_count' => 2, 'order_id' => '#204', 'time_seated' => '25 mins ago'],
            ['table_no' => 'T-02', 'capacity' => 4, 'status' => 'Available', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
            ['table_no' => 'T-03', 'capacity' => 4, 'status' => 'Occupied', 'guest_count' => 3, 'order_id' => '#205', 'time_seated' => '40 mins ago'],
            ['table_no' => 'T-04', 'capacity' => 6, 'status' => 'Reserved', 'guest_count' => 0, 'order_id' => null, 'time_seated' => 'In 15 mins'],
            ['table_no' => 'T-05', 'capacity' => 2, 'status' => 'Available', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
            ['table_no' => 'T-06', 'capacity' => 8, 'status' => 'Occupied', 'guest_count' => 7, 'order_id' => '#208', 'time_seated' => '10 mins ago'],
            ['table_no' => 'T-07', 'capacity' => 4, 'status' => 'Cleaning', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
            ['table_no' => 'T-08', 'capacity' => 2, 'status' => 'Available', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
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
            'featured_dishes' => $featuredDishes,
            'tables' => $tablesOverview,
            'recent_orders' => $recentOrders,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
