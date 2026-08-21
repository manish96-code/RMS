<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $overviewStats = [
            'total_revenue' => 348500,
            'today_revenue' => 42850,
            'weekly_revenue' => 245000,
            'total_orders' => 1240,
            'today_orders' => 38,
            'avg_order_value' => 1127,
            'total_customers' => 890,
            'total_staff' => User::count(),
            'active_dishes' => 45,
            'occupied_tables' => '9 / 15',
        ];

        $weeklySalesChart = [
            ['day' => 'Mon', 'sales' => 32000, 'orders' => 28],
            ['day' => 'Tue', 'sales' => 38500, 'orders' => 34],
            ['day' => 'Wed', 'sales' => 41000, 'orders' => 36],
            ['day' => 'Thu', 'sales' => 42850, 'orders' => 38],
            ['day' => 'Fri', 'sales' => 54000, 'orders' => 48],
            ['day' => 'Sat', 'sales' => 68000, 'orders' => 62],
            ['day' => 'Sun', 'sales' => 72000, 'orders' => 65],
        ];

        $topDishes = [
            ['name' => 'Truffle Mushroom Pizza', 'category' => 'Pizzas', 'sales' => 142, 'revenue' => 68160, 'rating' => 4.9],
            ['name' => 'Grilled Butter Chicken Sizzler', 'category' => 'Main Course', 'sales' => 118, 'revenue' => 61360, 'rating' => 4.8],
            ['name' => 'Belgian Dark Chocolate Lava Cake', 'category' => 'Desserts', 'sales' => 95, 'revenue' => 27550, 'rating' => 4.95],
            ['name' => 'Artisanal Avocado Caesar Salad', 'category' => 'Starters', 'sales' => 82, 'revenue' => 27880, 'rating' => 4.7],
            ['name' => 'Sparkling Blueberry Mint Mocktail', 'category' => 'Beverages', 'sales' => 175, 'revenue' => 38500, 'rating' => 4.6],
        ];

        $recentTransactions = [
            [
                'id' => 'TXN-9041',
                'order_id' => '#208',
                'customer' => 'Robert Fox',
                'type' => 'Dine-In (T-06)',
                'payment_method' => 'UPI / GPay',
                'amount' => 2320,
                'status' => 'Completed',
                'date' => '20 Aug 2026, 09:30 PM'
            ],
            [
                'id' => 'TXN-9040',
                'order_id' => '#207',
                'customer' => 'Ananya Sharma',
                'type' => 'Dine-In (T-01)',
                'payment_method' => 'Credit Card',
                'amount' => 680,
                'status' => 'Completed',
                'date' => '20 Aug 2026, 09:12 PM'
            ],
            [
                'id' => 'TXN-9039',
                'order_id' => '#206',
                'customer' => 'David Miller',
                'type' => 'Dine-In (T-03)',
                'payment_method' => 'Cash',
                'amount' => 740,
                'status' => 'Pending',
                'date' => '20 Aug 2026, 08:55 PM'
            ],
            [
                'id' => 'TXN-9038',
                'order_id' => '#205',
                'customer' => 'Sophia Chen',
                'type' => 'Takeaway',
                'payment_method' => 'Card',
                'amount' => 680,
                'status' => 'Completed',
                'date' => '20 Aug 2026, 08:40 PM'
            ],
            [
                'id' => 'TXN-9037',
                'order_id' => '#204',
                'customer' => 'Rahul Verma',
                'type' => 'Online Delivery',
                'payment_method' => 'Zomato Pay',
                'amount' => 1450,
                'status' => 'Completed',
                'date' => '20 Aug 2026, 08:20 PM'
            ]
        ];

        $staffOverview = [
            ['name' => 'Rahul Sharma', 'role' => 'Head Chef', 'status' => 'On Duty', 'orders_handled' => 24],
            ['name' => 'Priya Patel', 'role' => 'Senior Waiter', 'status' => 'On Duty', 'orders_handled' => 18],
            ['name' => 'Amit Kumar', 'role' => 'Cashier', 'status' => 'On Duty', 'orders_handled' => 38],
            ['name' => 'Neha Singh', 'role' => 'Floor Supervisor', 'status' => 'Off Duty', 'orders_handled' => 0],
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Admin Dashboard analytics loaded',
            'stats' => $overviewStats,
            'weekly_sales' => $weeklySalesChart,
            'top_dishes' => $topDishes,
            'recent_transactions' => $recentTransactions,
            'staff' => $staffOverview,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
