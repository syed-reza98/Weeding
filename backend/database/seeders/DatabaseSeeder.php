<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\Content;
use App\Models\Accommodation;
use App\Models\Transportation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@wedding.test',
            'phone' => '+1234567890',
            'language_preference' => 'en',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567891',
            'language_preference' => 'en',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'জন ডো',
            'email' => 'john.bn@example.com',
            'phone' => '+1234567892',
            'language_preference' => 'bn',
            'password' => Hash::make('password'),
        ]);

        // Create events
        Event::create([
            'name_en' => 'Mehendi Ceremony',
            'name_bn' => 'মেহেন্দি অনুষ্ঠান',
            'description_en' => 'Traditional henna ceremony with music and dance',
            'description_bn' => 'ঐতিহ্যবাহী হেনা অনুষ্ঠান সঙ্গীত ও নৃত্যের সাথে',
            'event_date' => '2025-12-20 16:00:00',
            'venue_name' => 'Grand Palace Hotel',
            'venue_address' => '123 Wedding Street, City, State 12345',
            'dress_code_en' => 'Traditional Indian wear in yellow/orange colors',
            'dress_code_bn' => 'হলুদ/কমলা রঙের ঐতিহ্যবাহী ভারতীয় পোশাক',
            'is_active' => true,
        ]);

        Event::create([
            'name_en' => 'Holud Ceremony',
            'name_bn' => 'হলুদ অনুষ্ঠান',
            'description_en' => 'Bengali turmeric ceremony with traditional rituals',
            'description_bn' => 'ঐতিহ্যবাহী আচার-অনুষ্ঠান সহ বাঙালি হলুদ অনুষ্ঠান',
            'event_date' => '2025-12-21 14:00:00',
            'venue_name' => 'Heritage Banquet Hall',
            'venue_address' => '456 Celebration Avenue, City, State 12345',
            'dress_code_en' => 'Traditional Bengali attire in yellow',
            'dress_code_bn' => 'হলুদ রঙের ঐতিহ্যবাহী বাঙালি পোশাক',
            'is_active' => true,
        ]);

        Event::create([
            'name_en' => 'Wedding Ceremony',
            'name_bn' => 'বিবাহ অনুষ্ঠান',
            'description_en' => 'The main wedding ceremony with traditional vows',
            'description_bn' => 'ঐতিহ্যবাহী শপথ সহ প্রধান বিবাহ অনুষ্ঠান',
            'event_date' => '2025-12-22 18:00:00',
            'venue_name' => 'Royal Wedding Gardens',
            'venue_address' => '789 Garden Plaza, City, State 12345',
            'dress_code_en' => 'Formal traditional Indian wedding attire',
            'dress_code_bn' => 'আনুষ্ঠানিক ঐতিহ্যবাহী ভারতীয় বিবাহের পোশাক',
            'is_active' => true,
        ]);

        Event::create([
            'name_en' => 'Reception Party',
            'name_bn' => 'অভ্যর্থনা পার্টি',
            'description_en' => 'Celebration dinner and dance party',
            'description_bn' => 'উদযাপনের রাতের খাবার এবং নৃত্য পার্টি',
            'event_date' => '2025-12-23 19:00:00',
            'venue_name' => 'Grand Ballroom',
            'venue_address' => '101 Reception Boulevard, City, State 12345',
            'dress_code_en' => 'Cocktail or formal evening wear',
            'dress_code_bn' => 'ককটেল বা আনুষ্ঠানিক সন্ধ্যার পোশাক',
            'is_active' => true,
        ]);

        // Create content
        $contentData = [
            ['home', 'welcome_title', 'Welcome to Our Wedding', 'আমাদের বিবাহে স্বাগতম'],
            ['home', 'welcome_message', 'Join us in celebrating our special day', 'আমাদের বিশেষ দিনে আমাদের সাথে উদযাপনে যোগ দিন'],
            ['home', 'couple_names', 'John & Jane', 'জন ও জেন'],
            ['home', 'wedding_date', 'December 22, 2025', '২২ ডিসেম্বর, ২০২৫'],
            ['about', 'our_story', 'This is our love story...', 'এটি আমাদের প্রেমের গল্প...'],
            ['contact', 'phone', '+1 (555) 123-4567', '+১ (৫৫৫) ১২৩-৪৫৬৭'],
            ['contact', 'email', 'contact@ourwedding.com', 'contact@ourwedding.com'],
            ['travel-guide', 'visa_info', 'Visa requirements for international guests', 'আন্তর্জাতিক অতিথিদের জন্য ভিসার প্রয়োজনীয়তা'],
        ];

        foreach ($contentData as $content) {
            Content::create([
                'section' => $content[0],
                'key' => $content[1],
                'content_en' => $content[2],
                'content_bn' => $content[3],
            ]);
        }

        // Create accommodations
        Accommodation::create([
            'name' => 'Grand Palace Hotel',
            'description' => 'Luxury hotel with wedding packages and spa services',
            'contact_info' => '+1 (555) 100-0001',
            'booking_url' => 'https://grandpalace.com/booking',
            'price_range_min' => 150.00,
            'price_range_max' => 300.00,
            'rating' => 5,
            'amenities' => ['WiFi', 'Spa', 'Pool', 'Restaurant', 'Room Service'],
        ]);

        Accommodation::create([
            'name' => 'Heritage Inn',
            'description' => 'Boutique hotel with traditional charm and modern amenities',
            'contact_info' => '+1 (555) 100-0002',
            'booking_url' => 'https://heritageinn.com/reserve',
            'price_range_min' => 100.00,
            'price_range_max' => 200.00,
            'rating' => 4,
            'amenities' => ['WiFi', 'Restaurant', 'Parking', 'Business Center'],
        ]);

        // Create transportation
        Transportation::create([
            'route_name' => 'Airport to Hotels',
            'pickup_locations' => ['Terminal 1', 'Terminal 2', 'Terminal 3'],
            'departure_time' => '2025-12-20 10:00:00',
            'arrival_time' => '2025-12-20 11:30:00',
            'driver_contact' => '+1 (555) 200-0001',
            'capacity' => 25,
        ]);

        Transportation::create([
            'route_name' => 'Hotels to Mehendi Venue',
            'pickup_locations' => ['Grand Palace Hotel', 'Heritage Inn', 'City Center'],
            'departure_time' => '2025-12-20 15:00:00',
            'arrival_time' => '2025-12-20 15:45:00',
            'driver_contact' => '+1 (555) 200-0002',
            'capacity' => 50,
        ]);
    }
}