<?php

namespace Tests\Feature;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_events_list()
    {
        // Create test events
        Event::factory()->create([
            'name_en' => 'Test Event',
            'name_bn' => 'পরীক্ষা ইভেন্ট',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/events');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'description',
                            'event_date',
                            'venue_name',
                            'venue_address',
                        ]
                    ]
                ]);
    }

    public function test_can_get_specific_event()
    {
        $event = Event::factory()->create([
            'name_en' => 'Test Event',
            'name_bn' => 'পরীক্ষা ইভেন্ট',
            'is_active' => true,
        ]);

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
                        'rsvp_count',
                        'media_count',
                    ]
                ]);
    }

    public function test_returns_bengali_content_with_proper_header()
    {
        $event = Event::factory()->create([
            'name_en' => 'Test Event',
            'name_bn' => 'পরীক্ষা ইভেন্ট',
            'is_active' => true,
        ]);

        $response = $this->withHeaders([
            'Accept-Language' => 'bn'
        ])->getJson("/api/events/{$event->id}");

        $response->assertStatus(200)
                ->assertJsonPath('data.name', 'পরীক্ষা ইভেন্ট');
    }

    public function test_inactive_events_are_not_returned()
    {
        Event::factory()->create([
            'name_en' => 'Inactive Event',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/events');

        $response->assertStatus(200)
                ->assertJsonCount(0, 'data');
    }
}