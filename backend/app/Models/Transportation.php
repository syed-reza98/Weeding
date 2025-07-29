<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transportation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'route_name',
        'pickup_locations',
        'departure_time',
        'arrival_time',
        'driver_contact',
        'capacity',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pickup_locations' => 'array',
            'departure_time' => 'datetime',
            'arrival_time' => 'datetime',
            'capacity' => 'integer',
        ];
    }

    /**
     * Get the formatted duration of the journey.
     */
    public function getDurationAttribute()
    {
        if ($this->departure_time && $this->arrival_time) {
            $duration = $this->departure_time->diff($this->arrival_time);
            return $duration->format('%h hours %i minutes');
        }
        
        return null;
    }

    /**
     * Scope a query to get future transportation.
     */
    public function scopeFuture($query)
    {
        return $query->where('departure_time', '>', now());
    }

    /**
     * Scope a query to get transportation for today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('departure_time', today());
    }

    /**
     * Scope a query to order by departure time.
     */
    public function scopeByDepartureTime($query, $direction = 'asc')
    {
        return $query->orderBy('departure_time', $direction);
    }

    /**
     * Check if transportation has available capacity.
     */
    public function hasCapacity($requestedSeats = 1)
    {
        // This would need to be implemented with actual booking tracking
        // For now, we'll assume capacity is available
        return $this->capacity >= $requestedSeats;
    }
}