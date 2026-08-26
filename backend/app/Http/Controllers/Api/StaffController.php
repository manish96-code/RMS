<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    /**
     * GET /api/staff
     */
    public function index()
    {
        $staffList = User::where('role', 'staff')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Staff members retrieved successfully',
            'data' => [
                'staff' => $staffList,
            ],
        ], 200);
    }

    /**
     * POST /api/staff
     */
    public function store(StoreStaffRequest $request)
    {
        $staff = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'mobile' => $request->mobile,
            'phone' => $request->mobile,
            'password' => Hash::make($request->password),
            'role' => 'staff', // Automatically enforced as staff
            'status' => 'active',
            'is_active' => true,
            'shift' => $request->shift ?? 'Morning',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Staff created successfully',
            'data' => [
                'staff' => $staff,
            ],
        ], 201);
    }

    /**
     * GET /api/staff/{id}
     */
    public function show($id)
    {
        $staff = User::where('id', $id)->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'message' => 'Staff not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Staff retrieved successfully',
            'data' => [
                'staff' => $staff,
            ],
        ], 200);
    }

    /**
     * PUT /api/staff/{id}
     */
    public function update(UpdateStaffRequest $request, $id)
    {
        $staff = User::where('id', $id)->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'message' => 'Staff not found',
            ], 404);
        }

        $dataToUpdate = [];

        if ($request->has('name')) {
            $dataToUpdate['name'] = $request->name;
        }

        if ($request->has('email')) {
            $dataToUpdate['email'] = strtolower($request->email);
        }

        if ($request->has('mobile')) {
            $dataToUpdate['mobile'] = $request->mobile;
            $dataToUpdate['phone'] = $request->mobile;
        }

        if ($request->has('status')) {
            $dataToUpdate['status'] = $request->status;
            $dataToUpdate['is_active'] = strtolower($request->status) === 'active';
        }

        if ($request->has('shift')) {
            $dataToUpdate['shift'] = $request->shift;
        }

        $staff->update($dataToUpdate);

        return response()->json([
            'success' => true,
            'message' => 'Staff updated successfully',
            'data' => [
                'staff' => $staff->fresh(),
            ],
        ], 200);
    }

    /**
     * DELETE /api/staff/{id}
     */
    public function destroy($id)
    {
        $staff = User::where('id', $id)->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'message' => 'Staff not found',
            ], 404);
        }

        $staff->delete();

        return response()->json([
            'success' => true,
            'message' => 'Staff deleted successfully',
        ], 200);
    }

    /**
     * PUT /api/staff/{id}/toggle-status
     */
    public function toggleStatus($id)
    {
        $staff = User::where('id', $id)->first();

        if (!$staff) {
            return response()->json([
                'success' => false,
                'message' => 'Staff not found',
            ], 404);
        }

        $nextStatus = strtolower($staff->status) === 'active' ? 'inactive' : 'active';
        $staff->update([
            'status' => $nextStatus,
            'is_active' => $nextStatus === 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Staff status changed to {$nextStatus}",
            'data' => [
                'staff' => $staff->fresh(),
            ],
        ], 200);
    }
}
