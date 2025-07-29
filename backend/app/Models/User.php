<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'language_preference',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the RSVPs for the user.
     */
    public function rsvps()
    {
        return $this->hasMany(Rsvp::class);
    }

    /**
     * Get the media uploaded by the user.
     */
    public function media()
    {
        return $this->hasMany(Media::class);
    }

    /**
     * Get the guestbook messages by the user.
     */
    public function guestbookMessages()
    {
        return $this->hasMany(GuestbookMessage::class);
    }
}