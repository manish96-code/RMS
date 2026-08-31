<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Table;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

class OrderStatusService
{
    /**
     * Allowed order status transition mapping
     */
    protected const ALLOWED_TRANSITIONS = [
        'pending' => ['preparing', 'cancelled'],
        'preparing' => ['ready', 'cancelled'],
        'ready' => ['served', 'cancelled'],
        'served' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    /**
     * Validate and apply status transition to an order
     *
     * @param Order $order
     * @param string $targetStatus
     * @return Order
     * @throws InvalidArgumentException
     */
    public function transition(Order $order, string $targetStatus): Order
    {
        $currentStatus = $order->status;

        // If already in target status, return cleanly
        if ($currentStatus === $targetStatus) {
            return $order;
        }

        // Validate allowed transition
        if (!isset(self::ALLOWED_TRANSITIONS[$currentStatus]) ||
            !in_array($targetStatus, self::ALLOWED_TRANSITIONS[$currentStatus], true)) {
            throw new InvalidArgumentException(
                "Invalid order status transition from '{$currentStatus}' to '{$targetStatus}'."
            );
        }

        $order->status = $targetStatus;
        $now = Carbon::now();

        // Update corresponding timestamp field
        switch ($targetStatus) {
            case 'preparing':
                $order->preparing_at = $order->preparing_at ?? $now;
                break;
            case 'ready':
                $order->ready_at = $order->ready_at ?? $now;
                break;
            case 'served':
                $order->served_at = $order->served_at ?? $now;
                break;
            case 'completed':
                $order->completed_at = $order->completed_at ?? $now;
                // Free the dining table on completion
                if ($order->table) {
                    $order->table->update(['status' => 'available']);
                }
                break;
            case 'cancelled':
                $order->cancelled_at = $order->cancelled_at ?? $now;
                // Free table if cancelled
                if ($order->table) {
                    $order->table->update(['status' => 'available']);
                }
                break;
        }

        $order->save();

        return $order;
    }
}
