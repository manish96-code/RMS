<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
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
     * GET /api/dashboard
     * Fetch executive summary metrics and active operational data
     */
    public function index(Request $request)
    {
        $restaurantId = $this->getRestaurantId($request);

        if (!$restaurantId) {
            return response()->json([
                'success' => true,
                'message' => 'No restaurant configured yet',
                'data' => [
                    'today' => ['total_orders' => 0, 'completed_orders' => 0, 'sales' => 0],
                    'tables' => ['total' => 0, 'available' => 0, 'occupied' => 0, 'reserved' => 0],
                    'active_orders' => ['pending' => 0, 'preparing' => 0, 'ready' => 0, 'served' => 0],
                    'recent_orders' => [],
                ],
            ], 200);
        }

        $summaryData = $this->dashboardService->getDashboardSummary($restaurantId);

        return response()->json([
            'success' => true,
            'message' => 'Dashboard data fetched successfully',
            'data' => $summaryData,
        ], 200);
    }
}
