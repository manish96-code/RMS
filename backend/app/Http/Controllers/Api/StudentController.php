<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{

    public function index(){
        $students = User::all();
        return response()->json([
            'message' => 'Students list',
            'status' => 'success',
            'students' => $students,
            'data' => $students,
        ], 200)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function createStudent(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'required|email|max:50|unique:users,email',
            'phone' => 'nullable|string|max:15',
            'contact' => 'nullable|string|max:15',
        ]);

        $phone = $validatedData['phone'] ?? $validatedData['contact'] ?? null;

        if (empty($phone)) {
            return response()->json([
                'message' => 'Phone/contact is required',
            ], 422)->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $student = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $phone,
            'password' => Hash::make('password123'),
        ]);

        return response()->json([
            'message' => 'Student created successfully',
            'data' => $student,
        ], 201)->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function saveStudent(Request $request)
    {
        return $this->createStudent($request);
    }
}
