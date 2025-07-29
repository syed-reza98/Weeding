<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the RSVPs for the event.
     */
    public function rsvps()
    {
        return $this->hasMany(Rsvp::class);
    }

    /**
     * Get the media for the event.
     */
    public function media()
    {
        return $this->hasMany(Media::class);
    }

    /**
     * Get the localized name based on language preference.
     */
    public function getName($language = 'en')
    {
        return $language === 'bn' ? $this->name_bn : $this->name_en;
    }

    /**
     * Get the localized description based on language preference.
     */
    public function getDescription($language = 'en')
    {
        return $language === 'bn' ? $this->description_bn : $this->description_en;
    }

    /**
     * Get the localized dress code based on language preference.
     */
    public function getDressCode($language = 'en')
    {
        return $language === 'bn' ? $this->dress_code_bn : $this->dress_code_en;
    }
}