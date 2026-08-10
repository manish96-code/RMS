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
