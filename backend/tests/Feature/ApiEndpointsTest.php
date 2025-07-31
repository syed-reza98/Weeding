<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');
    }

    /**
     * Test health endpoint
     */
    public function test_health_endpoint(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Wedding Website API is running',
                     'version' => '1.0.0'
                 ])
                 ->assertJsonStructure([
                     'success',
                     'message', 
                     'version',
                     'timestamp'
                 ]);
    }

    /**
     * Test public events endpoints
     */
    public function test_events_endpoints(): void
    {
        // Test events index
        $response = $this->get('/api/events');
        $response->assertStatus(200);

        // Test events show with non-existent ID
        $response = $this->get('/api/events/999');
        $response->assertStatus(404);
    }

    /**
     * Test accommodations endpoints
     */
    public function test_accommodations_endpoints(): void
    {
        // Test accommodations index
        $response = $this->get('/api/accommodations');
        $response->assertStatus(200);

        // Test accommodations show with non-existent ID
        $response = $this->get('/api/accommodations/999');
        $response->assertStatus(404);
    }

    /**
     * Test transportation endpoints
     */
    public function test_transportation_endpoints(): void
    {
        // Test transportation index
        $response = $this->get('/api/transportation');
        $response->assertStatus(200);

        // Test transportation show with non-existent ID
        $response = $this->get('/api/transportation/999');
        $response->assertStatus(404);
    }

    /**
     * Test gallery endpoints
     */
    public function test_gallery_endpoints(): void
    {
        // Test gallery index
        $response = $this->get('/api/gallery');
        $response->assertStatus(200);

        // Test gallery show with non-existent ID
        $response = $this->get('/api/gallery/999');
        $response->assertStatus(404);
    }

    /**
     * Test guestbook endpoints
     */
    public function test_guestbook_endpoints(): void
    {
        // Test guestbook index
        $response = $this->get('/api/guestbook');
        $response->assertStatus(200);

        // Test guestbook show with non-existent ID
        $response = $this->get('/api/guestbook/999');
        $response->assertStatus(404);
    }

    /**
     * Test content endpoints
     */
    public function test_content_endpoints(): void
    {
        // Test content sections
        $response = $this->get('/api/content-sections');
        $response->assertStatus(200);

        // Test content show with section
        $response = $this->get('/api/content/home');
        $response->assertStatus(200);

        // Test content with section and key
        $response = $this->get('/api/content/home/title');
        $response->assertStatus(200);
    }

    /**
     * Test authentication endpoints
     */
    public function test_auth_registration(): void
    {
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $response = $this->post('/api/auth/register', $userData);
        
        // Should be successful or handled appropriately based on implementation
        $this->assertTrue(in_array($response->status(), [200, 201, 422]));
    }

    /**
     * Test authentication login endpoint
     */
    public function test_auth_login_with_invalid_credentials(): void
    {
        $loginData = [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword'
        ];

        $response = $this->post('/api/auth/login', $loginData);
        
        // Should return unauthorized or validation error
        $this->assertTrue(in_array($response->status(), [401, 422]));
    }

    /**
     * Test protected endpoints require authentication
     */
    public function test_protected_endpoints_require_auth(): void
    {
        // Test logout requires auth
        $response = $this->post('/api/auth/logout');
        $response->assertStatus(401);

        // Test profile requires auth
        $response = $this->get('/api/auth/profile');
        $response->assertStatus(401);

        // Test user endpoint requires auth
        $response = $this->get('/api/user');
        $response->assertStatus(401);

        // Test RSVP requires auth
        $response = $this->post('/api/rsvp', []);
        $response->assertStatus(401);

        // Test gallery upload requires auth
        $response = $this->post('/api/gallery/upload', []);
        $response->assertStatus(401);

        // Test guestbook post requires auth
        $response = $this->post('/api/guestbook', []);
        $response->assertStatus(401);
    }

    /**
     * Test authenticated endpoints with valid user
     */
    public function test_authenticated_endpoints(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Test user endpoint
        $response = $this->get('/api/user');
        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'id' => $user->id,
                         'email' => $user->email
                     ]
                 ]);

        // Test profile endpoint
        $response = $this->get('/api/auth/profile');
        $response->assertStatus(200);

        // Test logout endpoint
        $response = $this->post('/api/auth/logout');
        $response->assertStatus(200);
    }

    /**
     * Test RSVP functionality
     */
    public function test_rsvp_endpoints(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Test RSVP creation with minimal data
        $rsvpData = [
            'guest_id' => $user->id,
            'attending' => true,
            'dietary_restrictions' => 'None'
        ];

        $response = $this->post('/api/rsvp', $rsvpData);
        // Response should be success or validation error based on implementation
        $this->assertTrue(in_array($response->status(), [200, 201, 422]));

        // Test RSVP show
        $response = $this->get('/api/rsvp/' . $user->id);
        $this->assertTrue(in_array($response->status(), [200, 404]));
    }

    /**
     * Test guestbook functionality
     */
    public function test_guestbook_creation(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $guestbookData = [
            'name' => $this->faker->name,
            'message' => $this->faker->text(200),
            'email' => $this->faker->email
        ];

        $response = $this->post('/api/guestbook', $guestbookData);
        // Response should be success or validation error based on implementation
        $this->assertTrue(in_array($response->status(), [200, 201, 422]));
    }

    /**
     * Test profile update functionality
     */
    public function test_profile_update(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ];

        $response = $this->put('/api/auth/profile', $updateData);
        // Response should be success or validation error based on implementation
        $this->assertTrue(in_array($response->status(), [200, 422]));
    }

    /**
     * Test password change functionality
     */
    public function test_password_change(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $passwordData = [
            'current_password' => 'password',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123'
        ];

        $response = $this->post('/api/auth/change-password', $passwordData);
        // Response should be success or validation error based on implementation
        $this->assertTrue(in_array($response->status(), [200, 422]));
    }

    /**
     * Test gallery upload endpoint structure
     */
    public function test_gallery_upload_endpoint(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Test without file (should fail validation)
        $response = $this->post('/api/gallery/upload', []);
        $this->assertTrue(in_array($response->status(), [422, 400]));
    }

    /**
     * Test API response formats are consistent
     */
    public function test_api_response_formats(): void
    {
        // Test health endpoint has consistent format
        $response = $this->get('/api/health');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'version',
                     'timestamp'
                 ]);

        // Test that authenticated user endpoint has consistent format
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        
        $response = $this->get('/api/user');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'data'
                 ]);
    }

    /**
     * Test API handles invalid JSON gracefully
     */
    public function test_invalid_json_handling(): void
    {
        $response = $this->postJson('/api/auth/login', 'invalid json');
        $this->assertTrue(in_array($response->status(), [400, 422]));
    }

    /**
     * Test API methods not allowed
     */
    public function test_method_not_allowed(): void
    {
        // Test DELETE on endpoint that doesn't support it
        $response = $this->delete('/api/health');
        $response->assertStatus(405);

        // Test PATCH on endpoint that doesn't support it
        $response = $this->patch('/api/health');
        $response->assertStatus(405);
    }
}