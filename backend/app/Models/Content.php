<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'content';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'section',
        'key',
        'content_en',
        'content_bn',
    ];

    /**
     * Get the localized content based on language preference.
     */
    public function getContent($language = 'en')
    {
        return $language === 'bn' ? $this->content_bn : $this->content_en;
    }

    /**
     * Scope a query to get content for a specific section.
     */
    public function scopeForSection($query, $section)
    {
        return $query->where('section', $section);
    }

    /**
     * Scope a query to get content by key.
     */
    public function scopeByKey($query, $key)
    {
        return $query->where('key', $key);
    }

    /**
     * Get content by section and key.
     */
    public static function getByKey($section, $key, $language = 'en')
    {
        $content = static::forSection($section)->byKey($key)->first();
        
        return $content ? $content->getContent($language) : null;
    }

    /**
     * Get all content for a section.
     */
    public static function getSection($section, $language = 'en')
    {
        $contents = static::forSection($section)->get();
        
        $result = [];
        foreach ($contents as $content) {
            $result[$content->key] = $content->getContent($language);
        }
        
        return $result;
    }
}