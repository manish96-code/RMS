<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use App\Http\Requests\UpdateTableStatusRequest;
use App\Http\Resources\TableResource;
use App\Models\Restaurant;
use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
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
     * GET /api/tables
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

        $tables = Table::where('restaurant_id', $restaurantId)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Tables fetched successfully',
            'data' => TableResource::collection($tables),
        ], 200);
    }

    /**
     * POST /api/tables
     */
    public function store(StoreTableRequest $request)
    {
        $restaurantId = $this->getRestaurantId($request);

        if (!$restaurantId) {
            return response()->json([
                'success' => false,
                'message' => 'Please set up your restaurant before creating tables.',
            ], 422);
        }

        $table = Table::create([
            'restaurant_id' => $restaurantId,
            'table_number' => $request->table_number,
            'capacity' => $request->capacity,
            'status' => $request->status ?? 'available',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Table created successfully',
            'data' => new TableResource($table),
        ], 201);
    }

    /**
     * GET /api/tables/{id}
     */
    public function show(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $table = Table::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Table not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Table retrieved successfully',
            'data' => new TableResource($table),
        ], 200);
    }

    /**
     * PUT /api/tables/{id}
     */
    public function update(UpdateTableRequest $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $table = Table::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Table not found',
            ], 404);
        }

        // Only allow updating table_number and capacity from general update endpoint
        $table->update($request->only(['table_number', 'capacity']));

        return response()->json([
            'success' => true,
            'message' => 'Table updated successfully',
            'data' => new TableResource($table->fresh()),
        ], 200);
    }

    /**
     * DELETE /api/tables/{id}
     */
    public function destroy(Request $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $table = Table::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Table not found',
            ], 404);
        }

        // Prevent deleting an occupied table (Requirement 7 & 13)
        if ($table->status === 'occupied') {
            return response()->json([
                'success' => false,
                'message' => 'Occupied table cannot be deleted.',
            ], 422);
        }

        $table->delete();

        return response()->json([
            'success' => true,
            'message' => 'Table deleted successfully',
        ], 200);
    }

    /**
     * PATCH /api/tables/{id}/status
     */
    public function updateStatus(UpdateTableStatusRequest $request, $id)
    {
        $restaurantId = $this->getRestaurantId($request);

        $table = Table::where('restaurant_id', $restaurantId)
            ->where('id', $id)
            ->first();

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Table not found',
            ], 404);
        }

        $table->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Table status updated successfully',
            'data' => new TableResource($table->fresh()),
        ], 200);
    }
}
