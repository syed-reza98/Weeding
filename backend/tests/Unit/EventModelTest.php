<?php

namespace Tests\Unit;

use App\Models\Event;
use App\Models\User;
use App\Models\Rsvp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_event_has_correct_fillable_attributes()
    {
        $fillable = [
            'name_en',
            'name_bn',
            'description_en',
            'description_bn',
            'event_date',
            'venue_name',
            'venue_address',
            'dress_code_en',
            'dress_code_bn',
            'is_active',
        ];

        $event = new Event();
        
        $this->assertEquals($fillable, $event->getFillable());
    }

    public function test_can_get_localized_name()
    {
        $event = Event::factory()->make([
            'name_en' => 'Wedding Ceremony',
            'name_bn' => 'বিবাহ অনুষ্ঠান',
        ]);

        $this->assertEquals('Wedding Ceremony', $event->getName('en'));
        $this->assertEquals('বিবাহ অনুষ্ঠান', $event->getName('bn'));
        $this->assertEquals('Wedding Ceremony', $event->getName()); // Default to English
    }

    public function test_event_has_rsvps_relationship()
    {
        $event = Event::factory()->create();
        $user = User::factory()->create();
        
        $rsvp = Rsvp::factory()->create([
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);

        $this->assertTrue($event->rsvps->contains($rsvp));
    }

    public function test_event_date_is_cast_to_datetime()
    {
        $event = Event::factory()->create([
            'event_date' => '2025-12-25 18:00:00',
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $event->event_date);
    }
}