<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BillResource;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class BillingController extends Controller
{
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

        return null;
    }

    /**
     * GET /api/orders/{id}/bill
     * Fetch complete itemized bill information
     */
    public function show(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with(['table', 'staff', 'items.menuItem', 'restaurant', 'payment'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Bill fetched successfully',
            'data' => new BillResource($order),
        ], 200);
    }

    /**
     * GET /api/orders/{id}/receipt
     * Fetch printable receipt information after successful payment
     */
    public function receipt(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with(['table', 'staff', 'items.menuItem', 'restaurant', 'payment.paidBy'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        if (!$order->payment || $order->payment->status !== 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Receipt is only available after successful payment.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Receipt fetched successfully',
            'data' => new BillResource($order),
        ], 200);
    }
}
