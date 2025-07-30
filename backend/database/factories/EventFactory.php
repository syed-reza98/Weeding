<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name_en' => fake()->sentence(3),
            'name_bn' => 'বাংলা নাম',
            'description_en' => fake()->paragraph(),
            'description_bn' => 'বাংলা বিবরণ',
            'event_date' => fake()->dateTimeBetween('now', '+1 year'),
            'venue_name' => fake()->company(),
            'venue_address' => fake()->address(),
            'dress_code_en' => fake()->words(3, true),
            'dress_code_bn' => 'বাংলা ড্রেস কোড',
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the event is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}