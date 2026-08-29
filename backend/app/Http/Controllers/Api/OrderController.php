<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
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

        // For Staff users, link to the system's restaurant
        if ($user && $user->isStaff()) {
            $restaurant = Restaurant::first();
            return $restaurant ? $restaurant->id : null;
        }

        return null;
    }

    /**
     * Helper to generate unique order number (e.g. ORD-000001)
     */
    private function generateOrderNumber($restaurantId)
    {
        $lastOrder = Order::where('restaurant_id', $restaurantId)->orderBy('id', 'desc')->first();
        $nextId = $lastOrder ? $lastOrder->id + 1 : 1;
        return 'ORD-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }

    /**
     * GET /api/orders
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

        $query = Order::where('restaurant_id', $restaurantId)
            ->with(['table', 'staff', 'items.menuItem']);

        // Optional filter: status
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Optional filter: table_id
        if ($request->has('table_id') && !empty($request->table_id)) {
            $query->where('table_id', $request->table_id);
        }

        // Optional filter: staff_id
        if ($request->has('staff_id') && !empty($request->staff_id)) {
            $query->where('staff_id', $request->staff_id);
        }

        // Optional filter: date (YYYY-MM-DD)
        if ($request->has('date') && !empty($request->date)) {
            $query->whereDate('created_at', $request->date);
        }

        // Optional filter: search (order_number or table_number)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('table', function ($tQuery) use ($search) {
                      $tQuery->where('table_number', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Orders fetched successfully',
            'data' => OrderResource::collection($orders),
        ], 200);
    }

    /**
     * POST /api/orders
     */
    public function store(StoreOrderRequest $request)
    {
        $restaurantId = $this->getRestaurantId($request);

        if (!$restaurantId) {
            return response()->json([
                'success' => false,
                'message' => 'Please set up your restaurant before taking orders.',
            ], 422);
        }

        // Step 1: Verify Table
        $table = Table::where('restaurant_id', $restaurantId)
            ->where('id', $request->table_id)
            ->first();

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Selected table does not belong to your restaurant.',
            ], 422);
        }

        if ($table->status === 'occupied') {
            return response()->json([
                'success' => false,
                'message' => 'This table is currently occupied.',
            ], 422);
        }

        // Step 2: Validate items & calculate price snapshot
        $itemsData = [];
        $runningSubtotal = 0;

        foreach ($request->items as $itemInput) {
            $menuItem = MenuItem::where('restaurant_id', $restaurantId)
                ->where('id', $itemInput['menu_item_id'])
                ->first();

            if (!$menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'One or more selected menu items do not belong to your restaurant.',
                ], 422);
            }

            if (!$menuItem->is_available) {
                return response()->json([
                    'success' => false,
                    'message' => "{$menuItem->name} is currently unavailable.",
                ], 422);
            }

            $priceSnapshot = (float) $menuItem->price;
            $qty = (int) $itemInput['quantity'];
            $itemSubtotal = $priceSnapshot * $qty;
            $runningSubtotal += $itemSubtotal;

            $itemsData[] = [
                'menu_item_id' => $menuItem->id,
                'quantity' => $qty,
                'price' => $priceSnapshot,
                'subtotal' => $itemSubtotal,
                'notes' => $itemInput['notes'] ?? null,
            ];
        }

        // Step 3: Calculate order totals (5% GST tax)
        $tax = round($runningSubtotal * 0.05, 2);
        $discount = 0.0;
        $total = $runningSubtotal + $tax - $discount;

        $orderNumber = $this->generateOrderNumber($restaurantId);

        // Step 4: Execute DB Transaction
        try {
            $order = DB::transaction(function () use ($restaurantId, $table, $request, $orderNumber, $runningSubtotal, $tax, $discount, $total, $itemsData) {
                $createdOrder = Order::create([
                    'restaurant_id' => $restaurantId,
                    'table_id' => $table->id,
                    'staff_id' => $request->user()->id,
                    'order_number' => $orderNumber,
                    'status' => 'pending',
                    'subtotal' => $runningSubtotal,
                    'tax' => $tax,
                    'discount' => $discount,
                    'total' => $total,
                    'notes' => $request->notes ?? null,
                ]);

                foreach ($itemsData as $item) {
                    $item['order_id'] = $createdOrder->id;
                    OrderItem::create($item);
                }

                // Update Table Status to occupied
                $table->update(['status' => 'occupied']);

                return $createdOrder;
            });

            return response()->json([
                'success' => true,
                'message' => "Order #{$order->order_number} created successfully",
                'data' => new OrderResource($order->load(['table', 'staff', 'items.menuItem'])),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/orders/{id}
     */
    public function show(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with(['table', 'staff', 'items.menuItem'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order fetched successfully',
            'data' => new OrderResource($order),
        ], 200);
    }

    /**
     * PATCH /api/orders/{id}/status
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => new OrderResource($order->fresh(['table', 'staff', 'items.menuItem'])),
        ], 200);
    }

    /**
     * POST /api/orders/{id}/cancel
     */
    public function cancel(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with('table')
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        if ($order->status === 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'Completed orders cannot be cancelled.',
            ], 422);
        }

        DB::transaction(function () use ($order) {
            $order->update(['status' => 'cancelled']);

            // Release table
            if ($order->table) {
                $order->table->update(['status' => 'available']);
            }
        });

        return response()->json([
            'success' => true,
            'message' => "Order #{$order->order_number} cancelled successfully",
            'data' => new OrderResource($order->fresh(['table', 'staff', 'items.menuItem'])),
        ], 200);
    }
}
