<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PaymentService
{
    protected OrderStatusService $orderStatusService;

    public function __construct(OrderStatusService $orderStatusService)
    {
        $this->orderStatusService = $orderStatusService;
    }

    /**
     * Generate unique payment reference number (e.g. PAY-000001)
     */
    private function generatePaymentNumber($restaurantId): string
    {
        $lastPayment = Payment::where('restaurant_id', $restaurantId)->orderBy('id', 'desc')->first();
        $nextId = $lastPayment ? $lastPayment->id + 1 : 1;
        return 'PAY-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Process payment for an order atomically within a DB Transaction
     *
     * @param Order $order
     * @param string $paymentMethod
     * @param User $paidBy
     * @return Payment
     * @throws InvalidArgumentException
     */
    public function processPayment(Order $order, string $paymentMethod, User $paidBy): Payment
    {
        // 1. Eligibility Checks
        if ($order->status === 'cancelled') {
            throw new InvalidArgumentException('Cancelled orders cannot be billed.');
        }

        if ($order->status !== 'served') {
            throw new InvalidArgumentException('This order is not ready for billing.');
        }

        // 2. Duplicate Payment Protection
        if ($order->payment && $order->payment->status === 'paid') {
            throw new InvalidArgumentException('Payment has already been completed for this order.');
        }

        // Validate payment method
        $validMethods = ['cash', 'upi', 'card'];
        if (!in_array(strtolower($paymentMethod), $validMethods, true)) {
            throw new InvalidArgumentException('Invalid payment method. Supported methods: cash, upi, card.');
        }

        // 3. Execute DB Transaction (Atomic Execution)
        return DB::transaction(function () use ($order, $paymentMethod, $paidBy) {
            // Generate payment reference number securely on backend
            $paymentNumber = $this->generatePaymentNumber($order->restaurant_id);

            // Create Payment Record
            $payment = Payment::create([
                'restaurant_id' => $order->restaurant_id,
                'order_id' => $order->id,
                'payment_number' => $paymentNumber,
                'payment_method' => strtolower($paymentMethod),
                'amount' => $order->total,
                'status' => 'paid',
                'paid_by' => $paidBy->id,
                'paid_at' => Carbon::now(),
            ]);

            // Transition Order Status from served -> completed (sets completed_at and frees table to available)
            $this->orderStatusService->transition($order, 'completed');

            return $payment->load(['order', 'restaurant', 'paidBy']);
        });
    }
}
