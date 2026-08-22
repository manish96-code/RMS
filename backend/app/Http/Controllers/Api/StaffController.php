<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    /**
     * Seed initial sample staff users if database has no staff members
     */
    private function seedInitialStaffIfEmpty()
    {
        if (User::whereNotNull('role')->count() === 0) {
            $sampleStaff = [
                [
                    'name' => 'Rahul Sharma',
                    'email' => 'rahul.chef@gourmethaven.com',
                    'phone' => '+91 98765 43210',
                    'role' => 'Head Chef',
                    'shift' => 'Morning',
                    'status' => 'On Duty',
                    'orders_handled' => 24,
                    'password' => Hash::make('password123'),
                ],
                [
                    'name' => 'Priya Patel',
                    'email' => 'priya.waiter@gourmethaven.com',
                    'phone' => '+91 98765 43211',
                    'role' => 'Senior Waiter',
                    'shift' => 'Morning',
                    'status' => 'On Duty',
                    'orders_handled' => 18,
                    'password' => Hash::make('password123'),
                ],
                [
                    'name' => 'Amit Kumar',
                    'email' => 'amit.cashier@gourmethaven.com',
                    'phone' => '+91 98765 43212',
                    'role' => 'Cashier',
                    'shift' => 'Evening',
                    'status' => 'On Duty',
                    'orders_handled' => 38,
                    'password' => Hash::make('password123'),
                ],
                [
                    'name' => 'Neha Singh',
                    'email' => 'neha.supervisor@gourmethaven.com',
                    'phone' => '+91 98765 43213',
                    'role' => 'Floor Supervisor',
                    'shift' => 'Night',
                    'status' => 'Off Duty',
                    'orders_handled' => 0,
                    'password' => Hash::make('password123'),
                ]
            ];

            foreach ($sampleStaff as $staffData) {
                User::create($staffData);
            }
        }
    }

    /**
     * GET /api/staff
     */
    public function index()
    {
        $this->seedInitialStaffIfEmpty();

        $staffList = User::whereNotNull('role')->orderBy('id', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Staff members fetched successfully from users table',
            'count' => $staffList->count(),
            'staff' => $staffList,
            'data' => $staffList,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * POST /api/admin/staff or /api/staff
     * Add staff user for Admin
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'phone' => 'required|string|max:20',
            'role' => 'required|string|max:50',
            'shift' => 'nullable|string|max:30',
            'status' => 'nullable|string|in:On Duty,Off Duty,On Leave',
            'password' => 'nullable|string|min:6',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => strtolower($validatedData['email']),
            'phone' => $validatedData['phone'],
            'role' => $validatedData['role'],
            'shift' => $validatedData['shift'] ?? 'Morning',
            'status' => $validatedData['status'] ?? 'On Duty',
            'orders_handled' => 0,
            'password' => Hash::make($validatedData['password'] ?? 'password123'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Staff user '{$user->name}' registered successfully in users table!",
            'data' => $user,
            'staff' => $user,
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
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff user not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        return response()->json([
            'status' => 'success',
            'data' => $user,
            'staff' => $user,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * PUT /api/staff/{id}
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff user not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|max:100|unique:users,email,' . $id,
            'phone' => 'sometimes|required|string|max:20',
            'role' => 'sometimes|required|string|max:50',
            'shift' => 'nullable|string|max:30',
            'status' => 'nullable|string|in:On Duty,Off Duty,On Leave',
            'orders_handled' => 'nullable|integer|min:0',
        ]);

        $user->update($validatedData);

        return response()->json([
            'status' => 'success',
            'message' => 'Staff user details updated successfully',
            'data' => $user,
            'staff' => $user,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * DELETE /api/staff/{id}
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff user not found',
            ], 404)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Staff user removed successfully from users table',
            'id' => $id,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
