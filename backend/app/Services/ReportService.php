<?php

namespace App\Services;

use App\Models\Payment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Generate date-filtered sales report for a restaurant
     *
     * @param int $restaurantId
     * @param string|null $from
     * @param string|null $to
     * @return array
     */
    public function getSalesReport(int $restaurantId, ?string $from = null, ?string $to = null): array
    {
        $fromDate = $from ? Carbon::parse($from)->startOfDay() : Carbon::today()->startOfDay();
        $toDate = $to ? Carbon::parse($to)->endOfDay() : Carbon::today()->endOfDay();

        // 1. Total Sales Sum from Paid Payments
        $totalSales = (float) Payment::where('restaurant_id', $restaurantId)
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$fromDate, $toDate])
            ->sum('amount');

        // 2. Total Paid Orders Count
        $totalPaidOrders = Payment::where('restaurant_id', $restaurantId)
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$fromDate, $toDate])
            ->count();

        // 3. Average Order Value (AOV)
        $averageOrderValue = $totalPaidOrders > 0 ? round($totalSales / $totalPaidOrders, 2) : 0.00;

        // 4. Daily Sales Breakdown Roster
        $dailySalesQuery = Payment::where('restaurant_id', $restaurantId)
            ->where('status', 'paid')
            ->whereBetween('paid_at', [$fromDate, $toDate])
            ->select(
                DB::raw('DATE(paid_at) as date'),
                DB::raw('SUM(amount) as sales'),
                DB::raw('COUNT(id) as orders')
            )
            ->groupBy(DB::raw('DATE(paid_at)'))
            ->orderBy('date', 'desc')
            ->get();

        $dailySales = $dailySalesQuery->map(function ($item) {
            $salesAmt = (float) $item->sales;
            $ordersCount = (int) $item->orders;
            return [
                'date' => $item->date,
                'sales' => round($salesAmt, 2),
                'orders' => $ordersCount,
                'average_order_value' => $ordersCount > 0 ? round($salesAmt / $ordersCount, 2) : 0.00,
            ];
        });

        return [
            'from' => $fromDate->toDateString(),
            'to' => $toDate->toDateString(),
            'total_sales' => round($totalSales, 2),
            'total_paid_orders' => $totalPaidOrders,
            'average_order_value' => $averageOrderValue,
            'daily_sales' => $dailySales,
        ];
    }
}
