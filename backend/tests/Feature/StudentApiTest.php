<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

test('it can create a student via the api', function () {
    $response = $this->postJson('/api/create-student', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('message', 'Student created successfully')
        ->assertJsonPath('data.name', 'John Doe');

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);
})->uses(RefreshDatabase::class);

test('it can create a student from the students endpoint used by the form', function () {
    $response = $this->postJson('/api/students', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'contact' => '9876543210',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('message', 'Student created successfully')
        ->assertJsonPath('data.name', 'Jane Doe');

    $this->assertDatabaseHas('users', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ]);
})->uses(RefreshDatabase::class);
