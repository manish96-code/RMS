<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with default Admin and Staff.
     */
    public function run(): void
    {
        // 1. Create Default Admin User
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'mobile' => '9876543210',
                'phone' => '9876543210',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'is_active' => true,
            ]
        );

        // 2. Create Default Staff User
        User::updateOrCreate(
            ['email' => 'rahul@example.com'],
            [
                'name' => 'Rahul Kumar',
                'mobile' => '9876543210',
                'phone' => '9876543210',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'status' => 'active',
                'is_active' => true,
                'shift' => 'Morning',
            ]
        );
    }
}
