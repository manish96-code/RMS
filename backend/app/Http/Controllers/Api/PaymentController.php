<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Restaurant;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use InvalidArgumentException;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
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

        return null;
    }

    /**
     * POST /api/orders/{id}/payment
     * Process payment for a served order inside an atomic DB transaction
     */
    public function store(StorePaymentRequest $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with(['table', 'staff', 'items', 'payment'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        try {
            $payment = $this->paymentService->processPayment(
                $order,
                $request->payment_method,
                $request->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Payment completed successfully',
                'data' => new PaymentResource($payment),
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Failed to process payment.',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while processing payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/orders/{id}/payment
     * Fetch payment details for an order
     */
    public function show(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $order = Order::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->with(['payment.paidBy', 'table'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        if (!$order->payment) {
            return response()->json([
                'success' => false,
                'message' => 'No payment record found for this order.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment fetched successfully',
            'data' => new PaymentResource($order->payment),
        ], 200);
    }
}
