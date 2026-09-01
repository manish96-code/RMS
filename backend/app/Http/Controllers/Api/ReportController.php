<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Services\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Helper to get authenticated user's restaurant ID
     */
    private function getRestaurantId(Request $request)
    {
        $user = $request->user();
        if ($user && $user->restaurant) {
            return $user->restaurant->id;
        }

        if ($user && $user->isStaff()) {
            $restaurant = Restaurant::first();
            return $restaurant ? $restaurant->id : null;
        }

        $firstRestaurant = Restaurant::first();
        return $firstRestaurant ? $firstRestaurant->id : null;
    }

    /**
     * GET /api/reports/sales
     * Fetch date-range sales report (accepts optional ?from=YYYY-MM-DD&to=YYYY-MM-DD)
     */
    public function sales(Request $request)
    {
        $restaurantId = $this->getRestaurantId($request);

        if (!$restaurantId) {
            return response()->json([
                'success' => true,
                'message' => 'No restaurant configured yet',
                'data' => [
                    'from' => now()->toDateString(),
                    'to' => now()->toDateString(),
                    'total_sales' => 0,
                    'total_paid_orders' => 0,
                    'average_order_value' => 0,
                    'daily_sales' => [],
                ],
            ], 200);
        }

        $from = $request->query('from');
        $to = $request->query('to');

        $reportData = $this->reportService->getSalesReport($restaurantId, $from, $to);

        return response()->json([
            'success' => true,
            'message' => 'Sales report fetched successfully',
            'data' => $reportData,
        ], 200);
    }
}
