<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accommodation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'contact_info',
        'booking_url',
        'price_range_min',
        'price_range_max',
        'rating',
        'amenities',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_range_min' => 'decimal:2',
            'price_range_max' => 'decimal:2',
            'rating' => 'integer',
            'amenities' => 'array',
        ];
    }

    /**
     * Get the formatted price range.
     */
    public function getPriceRangeAttribute()
    {
        if ($this->price_range_min && $this->price_range_max) {
            return "$" . number_format($this->price_range_min, 2) . " - $" . number_format($this->price_range_max, 2);
        }
        
        if ($this->price_range_min) {
            return "From $" . number_format($this->price_range_min, 2);
        }
        
        if ($this->price_range_max) {
            return "Up to $" . number_format($this->price_range_max, 2);
        }
        
        return "Contact for pricing";
    }

    /**
     * Scope a query to order by rating.
     */
    public function scopeByRating($query, $direction = 'desc')
    {
        return $query->orderBy('rating', $direction);
    }

    /**
     * Scope a query to filter by price range.
     */
    public function scopeInPriceRange($query, $minPrice, $maxPrice)
    {
        return $query->where(function ($query) use ($minPrice, $maxPrice) {
            $query->whereBetween('price_range_min', [$minPrice, $maxPrice])
                  ->orWhereBetween('price_range_max', [$minPrice, $maxPrice]);
        });
    }
}