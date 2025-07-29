# Wedding Website Backend API

Laravel 11.x backend API for the wedding website platform with multilingual support (English/Bengali).

## Features

- **RESTful API Architecture** - Clean, standard API endpoints
- **Multilingual Support** - English and Bengali content
- **Authentication** - Laravel Sanctum for API authentication
- **Database Design** - Comprehensive schema for wedding management
- **File Uploads** - Media gallery with image/video support
- **RSVP Management** - Guest confirmation and tracking
- **Content Management** - CMS for dynamic content
- **Security** - Input validation, CORS, and security middleware

## Database Schema

### Core Tables
- **users** - User accounts with language preferences
- **events** - Wedding events with multilingual content
- **rsvps** - Guest confirmations and dietary preferences
- **accommodations** - Hotel and lodging information
- **transportation** - Logistics and shuttle information
- **media** - Photo/video gallery with approval system
- **guestbook_messages** - Guest wishes and messages
- **content** - CMS content with multilingual support

## API Endpoints

### Public Endpoints
```
GET    /api/events                 - Get all active events
GET    /api/events/{id}            - Get specific event details
GET    /api/gallery                - Get approved media gallery
GET    /api/gallery/{id}           - Get specific media item
GET    /api/guestbook              - Get approved guestbook messages
GET    /api/content/{section}      - Get CMS content for section
GET    /api/health                 - API health check
```

### Authenticated Endpoints
```
POST   /api/rsvp                   - Submit/update RSVP
GET    /api/rsvp/{guestId}         - Get guest RSVP status
POST   /api/gallery/upload         - Upload media files
POST   /api/guestbook              - Post guestbook message
GET    /api/user                   - Get authenticated user info
```

## Setup Instructions

### Prerequisites
- PHP 8.3+
- MySQL 8.0+
- Composer

### Installation

1. **Install Dependencies**
   ```bash
   composer install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. **Storage Setup**
   ```bash
   php artisan storage:link
   ```

5. **Start Development Server**
   ```bash
   php artisan serve
   ```

### Environment Variables

Key environment variables to configure:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wedding_website
DB_USERNAME=root
DB_PASSWORD=

# CORS for Frontend
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Sanctum for Authentication  
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001
```

## Multilingual Support

The API supports English and Bengali languages:

- **Language Detection**: Via `Accept-Language` header
- **Supported Values**: `en` (English), `bn` (Bengali)
- **Default**: English (`en`)

### Example Request
```bash
curl -H "Accept-Language: bn" http://localhost:8000/api/events
```

## Authentication

Uses Laravel Sanctum for API authentication:

1. **Register/Login** - Obtain API token
2. **API Requests** - Include `Authorization: Bearer {token}` header
3. **Protected Routes** - RSVP submission, media upload, guestbook posting

## File Uploads

Media gallery supports:
- **Image Formats**: JPEG, PNG, GIF
- **Video Formats**: MP4, MOV, AVI  
- **Max Size**: 50MB per file
- **Max Files**: 10 files per upload
- **Approval**: Admin approval required for public display

## Security Features

- **Input Validation** - All inputs validated
- **File Upload Security** - MIME type checking, size limits
- **CORS Configuration** - Configurable allowed origins
- **Rate Limiting** - API rate limiting (Laravel default)
- **SQL Injection Protection** - Eloquent ORM protection

## Development Data

The database seeder includes:
- **4 Sample Events** - Mehendi, Holud, Wedding, Reception
- **3 Test Users** - Including multilingual user
- **Sample Content** - Home, about, contact content
- **Accommodations** - Hotel information
- **Transportation** - Shuttle schedules

## API Response Format

Standard JSON response format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }  // Validation errors if applicable
}
```

## Testing

Run tests:
```bash
php artisan test
```

## Production Deployment

1. **Environment**: Set `APP_ENV=production`
2. **Optimize**: Run `php artisan optimize`
3. **Security**: Configure proper file permissions
4. **Database**: Run migrations on production
5. **Storage**: Configure cloud storage (S3)
6. **Caching**: Set up Redis for performance

## Contributing

1. Follow PSR-12 coding standards
2. Write tests for new features
3. Update documentation
4. Ensure multilingual support for new content

## License

This project is licensed under the MIT License.