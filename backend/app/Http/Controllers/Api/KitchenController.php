<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KitchenOrderResource;
use App\Models\Order;
use App\Models\Restaurant;
use App\Services\OrderStatusService;
use Illuminate\Http\Request;
use InvalidArgumentException;

class KitchenController extends Controller
{
    protected OrderStatusService $orderStatusService;

    public function __construct(OrderStatusService $orderStatusService)
    {
        $this->orderStatusService = $orderStatusService;
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

        // For Staff users, link to system's default restaurant
        if ($user && $user->isStaff()) {
            $restaurant = Restaurant::first();
            return $restaurant ? $restaurant->id : null;
        }

        return null;
    }

    /**
     * GET /api/kitchen/orders
     * Fetch all active kitchen orders (pending, preparing, ready)
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

        $kitchenOrders = Order::where('restaurant_id', $restaurantId)
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->with(['table', 'staff', 'items.menuItem'])
            ->orderBy('created_at', 'asc') // Oldest first for fair kitchen queueing
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Kitchen orders fetched successfully',
            'data' => KitchenOrderResource::collection($kitchenOrders),
        ], 200);
    }

    /**
     * PATCH /api/kitchen/orders/{id}/preparing
     * Transition order status: pending -> preparing
     */
    public function markPreparing(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with(['table', 'staff', 'items.menuItem'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Kitchen order not found',
            ], 404);
        }

        try {
            $updatedOrder = $this->orderStatusService->transition($order, 'preparing');

            return response()->json([
                'success' => true,
                'message' => 'Order marked as preparing successfully',
                'data' => new KitchenOrderResource($updatedOrder->load(['table', 'staff', 'items.menuItem'])),
            ], 200);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'This order cannot be moved to preparing.',
            ], 422);
        }
    }

    /**
     * PATCH /api/kitchen/orders/{id}/ready
     * Transition order status: preparing -> ready
     */
    public function markReady(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with(['table', 'staff', 'items.menuItem'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Kitchen order not found',
            ], 404);
        }

        try {
            $updatedOrder = $this->orderStatusService->transition($order, 'ready');

            return response()->json([
                'success' => true,
                'message' => 'Order marked as ready successfully',
                'data' => new KitchenOrderResource($updatedOrder->load(['table', 'staff', 'items.menuItem'])),
            ], 200);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'This order cannot be moved to ready.',
            ], 422);
        }
    }
}
