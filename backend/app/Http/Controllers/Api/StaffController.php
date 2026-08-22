<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    /**
     * Seed initial sample staff members if database is empty
     */
    private function seedInitialStaffIfEmpty()
    {
        if (Staff::count() === 0) {
            $sampleStaff = [
                [
                    'name' => 'Rahul Sharma',
                    'email' => 'rahul.chef@gourmethaven.com',
                    'phone' => '+91 98765 43210',
                    'role' => 'Head Chef',
                    'shift' => 'Morning',
                    'status' => 'On Duty',
                    'orders_handled' => 24
                ],
                [
                    'name' => 'Priya Patel',
                    'email' => 'priya.waiter@gourmethaven.com',
                    'phone' => '+91 98765 43211',
                    'role' => 'Senior Waiter',
                    'shift' => 'Morning',
                    'status' => 'On Duty',
                    'orders_handled' => 18
                ],
                [
                    'name' => 'Amit Kumar',
                    'email' => 'amit.cashier@gourmethaven.com',
                    'phone' => '+91 98765 43212',
                    'role' => 'Cashier',
                    'shift' => 'Evening',
                    'status' => 'On Duty',
                    'orders_handled' => 38
                ],
                [
                    'name' => 'Neha Singh',
                    'email' => 'neha.supervisor@gourmethaven.com',
                    'phone' => '+91 98765 43213',
                    'role' => 'Floor Supervisor',
                    'shift' => 'Night',
                    'status' => 'Off Duty',
                    'orders_handled' => 0
                ]
            ];

            foreach ($sampleStaff as $staffData) {
                Staff::create($staffData);
            }
        }
    }

    /**
     * GET /api/staff
     */
    public function index()
    {
        $this->seedInitialStaffIfEmpty();

        $staffList = Staff::orderBy('id', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Staff members fetched successfully',
            'count' => $staffList->count(),
            'staff' => $staffList,
            'data' => $staffList,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * POST /api/admin/staff or /api/staff
     * Add staff API for Admin
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:staff,email',
            'phone' => 'required|string|max:20',
            'role' => 'required|string|max:50',
            'shift' => 'nullable|string|max:30',
            'status' => 'nullable|string|in:On Duty,Off Duty,On Leave',
        ]);

        $staff = Staff::create([
            'name' => $validatedData['name'],
            'email' => strtolower($validatedData['email']),
            'phone' => $validatedData['phone'],
            'role' => $validatedData['role'],
            'shift' => $validatedData['shift'] ?? 'Morning',
            'status' => $validatedData['status'] ?? 'On Duty',
            'orders_handled' => 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Staff member '{$staff->name}' registered successfully!",
            'data' => $staff,
            'staff' => $staff,
        ], 201)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * Alias for store
     */
    public function createStaff(Request $request)
    {
        return $this->store($request);
    }

    /**
     * GET /api/staff/{id}
     */
    public function show($id)
    {
        $staff = Staff::find($id);

        if (!$staff) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff member not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        return response()->json([
            'status' => 'success',
            'data' => $staff,
            'staff' => $staff,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * PUT /api/staff/{id}
     */
    public function update(Request $request, $id)
    {
        $staff = Staff::find($id);

        if (!$staff) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff member not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|max:100|unique:staff,email,' . $id,
            'phone' => 'sometimes|required|string|max:20',
            'role' => 'sometimes|required|string|max:50',
            'shift' => 'nullable|string|max:30',
            'status' => 'nullable|string|in:On Duty,Off Duty,On Leave',
            'orders_handled' => 'nullable|integer|min:0',
        ]);

        $staff->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Staff member details updated successfully',
            'data' => $staff,
            'staff' => $staff,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * DELETE /api/staff/{id}
     */
    public function destroy($id)
    {
        $staff = Staff::find($id);

        if (!$staff) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff member not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $staff->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Staff member removed successfully',
            'id' => $id,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
