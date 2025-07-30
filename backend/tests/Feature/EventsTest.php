<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Event;

class EventsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_events(): void
    {
        $response = $this->getJson('/api/events');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data'
                ]);
    }

    public function test_can_get_specific_event(): void
    {
        $event = Event::factory()->create();

        $response = $this->getJson("/api/events/{$event->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'name',
                        'description',
                        'event_date',
                        'venue_name',
                        'venue_address',
                        'dress_code',
                        'is_active'
                    ]
                ]);
    }

    public function test_returns_404_for_nonexistent_event(): void
    {
        $response = $this->getJson('/api/events/999');

        $response->assertStatus(404);
    }

    public function test_only_returns_active_events(): void
    {
        // Create active and inactive events
        Event::factory()->create(['is_active' => true]);
        Event::factory()->create(['is_active' => false]);

        $response = $this->getJson('/api/events');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        // Should only return 1 active event
        $this->assertCount(1, $data);
        $this->assertTrue($data[0]['is_active']);
    }
}
