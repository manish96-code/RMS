<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Table;
use Illuminate\Support\Carbon;

class DashboardService
{
    /**
     * Get summary metrics for the authenticated user's restaurant
     *
     * @param int $restaurantId
     * @return array
     */
    public function getDashboardSummary(int $restaurantId): array
    {
        $today = Carbon::today();

        // 1. Today's Total Orders Count
        $todayTotalOrders = Order::where('restaurant_id', $restaurantId)
            ->whereDate('created_at', $today)
            ->count();

        // 2. Today's Completed Orders Count
        $todayCompletedOrders = Order::where('restaurant_id', $restaurantId)
            ->where('status', 'completed')
            ->whereDate('updated_at', $today)
            ->count();

        // 3. Today's Total Sales (strictly from paid payments)
        $todaySales = (float) Payment::where('restaurant_id', $restaurantId)
            ->where('status', 'paid')
            ->whereDate('paid_at', $today)
            ->sum('amount');

        // 4. Dining Tables Overview
        $totalTables = Table::where('restaurant_id', $restaurantId)->count();
        $availableTables = Table::where('restaurant_id', $restaurantId)->where('status', 'available')->count();
        $occupiedTables = Table::where('restaurant_id', $restaurantId)->where('status', 'occupied')->count();
        $reservedTables = Table::where('restaurant_id', $restaurantId)->where('status', 'reserved')->count();

        // 5. Active Order Status Breakdown
        $pendingOrders = Order::where('restaurant_id', $restaurantId)->where('status', 'pending')->count();
        $preparingOrders = Order::where('restaurant_id', $restaurantId)->where('status', 'preparing')->count();
        $readyOrders = Order::where('restaurant_id', $restaurantId)->where('status', 'ready')->count();
        $servedOrders = Order::where('restaurant_id', $restaurantId)->where('status', 'served')->count();

        // 6. Top 8 Recent Orders
        $recentOrders = Order::where('restaurant_id', $restaurantId)
            ->with(['table', 'staff'])
            ->orderBy('id', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'table_number' => $order->table ? $order->table->table_number : 'N/A',
                    'staff_name' => $order->staff ? $order->staff->name : 'Staff',
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at ? $order->created_at->toDateTimeString() : null,
                ];
            });

        return [
            'today' => [
                'total_orders' => $todayTotalOrders,
                'completed_orders' => $todayCompletedOrders,
                'sales' => round($todaySales, 2),
            ],
            'tables' => [
                'total' => $totalTables,
                'available' => $availableTables,
                'occupied' => $occupiedTables,
                'reserved' => $reservedTables,
            ],
            'active_orders' => [
                'pending' => $pendingOrders,
                'preparing' => $preparingOrders,
                'ready' => $readyOrders,
                'served' => $servedOrders,
            ],
            'recent_orders' => $recentOrders,
        ];
    }
}
