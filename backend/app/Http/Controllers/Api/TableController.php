<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class TableController extends Controller
{
    /**
     * Seed initial sample tables if database is empty
     */
    private function seedInitialTablesIfEmpty()
    {
        if (RestaurantTable::count() === 0) {
            $sampleTables = [
                ['table_no' => 'T-01', 'capacity' => 2, 'status' => 'Occupied', 'guest_count' => 2, 'order_id' => '#204', 'time_seated' => '25 mins ago'],
                ['table_no' => 'T-02', 'capacity' => 4, 'status' => 'Available', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
                ['table_no' => 'T-03', 'capacity' => 4, 'status' => 'Occupied', 'guest_count' => 3, 'order_id' => '#205', 'time_seated' => '40 mins ago'],
                ['table_no' => 'T-04', 'capacity' => 6, 'status' => 'Reserved', 'guest_count' => 0, 'order_id' => null, 'time_seated' => 'In 15 mins'],
                ['table_no' => 'T-05', 'capacity' => 2, 'status' => 'Available', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
                ['table_no' => 'T-06', 'capacity' => 8, 'status' => 'Occupied', 'guest_count' => 7, 'order_id' => '#208', 'time_seated' => '10 mins ago'],
                ['table_no' => 'T-07', 'capacity' => 4, 'status' => 'Cleaning', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
                ['table_no' => 'T-08', 'capacity' => 2, 'status' => 'Available', 'guest_count' => 0, 'order_id' => null, 'time_seated' => null],
            ];

            foreach ($sampleTables as $tableData) {
                RestaurantTable::create($tableData);
            }
        }
    }

    /**
     * GET /api/tables
     */
    public function index()
    {
        $this->seedInitialTablesIfEmpty();

        $tables = RestaurantTable::orderBy('id', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Restaurant tables fetched successfully',
            'count' => $tables->count(),
            'tables' => $tables,
            'data' => $tables,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * POST /api/admin/tables or /api/tables
     * Add table API for Admin
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'table_no' => 'required|string|max:20|unique:restaurant_tables,table_no',
            'capacity' => 'required|integer|min:1|max:50',
            'status' => 'nullable|string|in:Available,Occupied,Reserved,Cleaning',
            'guest_count' => 'nullable|integer|min:0',
        ]);

        $table = RestaurantTable::create([
            'table_no' => strtoupper($validatedData['table_no']),
            'capacity' => $validatedData['capacity'],
            'status' => $validatedData['status'] ?? 'Available',
            'guest_count' => $validatedData['guest_count'] ?? 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Table {$table->table_no} added successfully!",
            'data' => $table,
            'table' => $table,
        ], 201)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * Alias for store
     */
    public function createTable(Request $request)
    {
        return $this->store($request);
    }

    /**
     * GET /api/tables/{id}
     */
    public function show($id)
    {
        $table = RestaurantTable::find($id);

        if (!$table) {
            return response()->json([
                'status' => 'error',
                'message' => 'Table not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        return response()->json([
            'status' => 'success',
            'data' => $table,
            'table' => $table,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * PUT /api/tables/{id}
     */
    public function update(Request $request, $id)
    {
        $table = RestaurantTable::find($id);

        if (!$table) {
            return response()->json([
                'status' => 'error',
                'message' => 'Table not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $validatedData = $request->validate([
            'table_no' => 'sometimes|required|string|max:20|unique:restaurant_tables,table_no,' . $id,
            'capacity' => 'sometimes|required|integer|min:1|max:50',
            'status' => 'nullable|string|in:Available,Occupied,Reserved,Cleaning',
            'guest_count' => 'nullable|integer|min:0',
            'order_id' => 'nullable|string',
            'time_seated' => 'nullable|string',
        ]);

        $table->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Table updated successfully',
            'data' => $table,
            'table' => $table,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * DELETE /api/tables/{id}
     */
    public function destroy($id)
    {
        $table = RestaurantTable::find($id);

        if (!$table) {
            return response()->json([
                'status' => 'error',
                'message' => 'Table not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $table->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Table deleted successfully',
            'id' => $id,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
