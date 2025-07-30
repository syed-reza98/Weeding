# Wedding Website Platform

A complete, modern wedding website platform built with Laravel 11 and Next.js 14, featuring multi-language support (English/Bengali), comprehensive event management, and production-ready deployment.

## 🎉 Features Implemented

### ✅ Core Wedding Website Features
- **Home Page** - Beautiful landing page with countdown timer and navigation
- **Event Schedule** - Multi-day event details with dress codes and timing
- **Location & Maps** - Google Maps integration with venue details and directions
- **RSVP System** - Guest confirmation with dietary restrictions and special requests
- **Photo/Video Gallery** - Media gallery with upload functionality and moderation
- **Accommodation** - Hotel listings with amenities, pricing, and booking links
- **Transportation** - Multiple transport options with schedules and contact info
- **Guestbook** - Message board for wedding wishes and memories
- **Admin Dashboard** - Content management system for wedding coordinators

### ✅ Advanced Features
- **Multi-language Support** - English and Bengali language switching
- **Email Notifications** - Beautiful HTML email templates for RSVP confirmations
- **Google Maps Integration** - Interactive maps with directions and venue details
- **State Management** - Zustand for global application state
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Authentication** - Laravel Sanctum API authentication system

### ✅ Technical Infrastructure
- **Backend API** - Laravel 11 with comprehensive REST endpoints
- **Frontend App** - Next.js 14 with TypeScript and modern React patterns
- **Database** - SQLite for development, easily configurable for production
- **Testing** - PHPUnit backend tests with proper test structure
- **Docker Support** - Multi-stage containerization for both frontend and backend
- **CI/CD Pipeline** - GitHub Actions workflow for automated testing and deployment

## 🚀 Screenshots

### Home Page
![Home Page](https://github.com/user-attachments/assets/dfe4cf9d-0085-4def-8267-a91c603745e5)

### Gallery Page
![Gallery Page](https://github.com/user-attachments/assets/294e02f8-ba9b-49d2-88fa-e3469b5fcd8b)

### Transportation Page
![Transportation Page](https://github.com/user-attachments/assets/048e6fbc-9578-40f3-9271-34d1eed6b3b8)

## 🛠️ Technology Stack

### Backend (Laravel 11)
- **Framework**: Laravel 11.x with PHP 8.2+
- **Database**: SQLite (development) / MySQL/PostgreSQL (production)
- **Authentication**: Laravel Sanctum for API tokens
- **Email**: Laravel Mail with queue support
- **Testing**: PHPUnit with comprehensive API tests
- **Caching**: Redis support for sessions and caching

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand for global state
- **Icons**: Lucide React for consistent iconography
- **Maps**: Google Maps JavaScript API integration
- **Build**: Optimized production builds with static generation

### DevOps & Deployment
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for development
- **CI/CD**: GitHub Actions with automated testing
- **Reverse Proxy**: Nginx configuration for production
- **Monitoring**: Ready for monitoring and logging integration

## 📋 Quick Start

### Prerequisites
- PHP 8.2+ with required extensions
- Node.js 18+ and npm
- Composer for PHP dependencies
- Docker (optional, for containerized development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wedding-website-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   touch database/database.sqlite
   php artisan migrate --seed
   php artisan serve --port=8000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Dashboard: http://localhost:3000/admin

### Docker Setup (Alternative)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - Redis: localhost:6379

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm run lint
npm run build
```

## 📂 Project Structure

```
wedding-website-platform/
├── backend/                    # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Mail/              # Email Templates
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Sample Data
│   ├── tests/                 # PHPUnit Tests
│   └── resources/views/emails/ # Email Templates
├── frontend/                   # Next.js 14 App
│   ├── app/                   # App Router Pages
│   ├── components/            # Reusable Components
│   ├── contexts/              # React Contexts
│   ├── hooks/                 # Custom Hooks
│   ├── store/                 # Zustand Store
│   └── types/                 # TypeScript Types
├── .github/workflows/         # CI/CD Pipeline
├── docker-compose.yml         # Docker Configuration
└── README.md                  # This file
```

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/health` - API health check
- `GET /api/events` - Get all wedding events
- `GET /api/events/:id` - Get specific event details
- `GET /api/content/:section` - Get CMS content
- `GET /api/gallery` - Get approved media gallery
- `GET /api/guestbook` - Get approved guestbook messages

### Authenticated Endpoints
- `POST /api/rsvp` - Submit/update RSVP
- `GET /api/rsvp/:guestId` - Get guest RSVP status
- `POST /api/gallery/upload` - Upload media files
- `POST /api/guestbook` - Post guestbook message

## 🌐 Multi-language Support

The platform supports English and Bengali languages with:
- Dynamic language switching in the UI
- Backend content delivery in both languages
- Proper date/time formatting for each locale
- Right-to-left text support where needed

## 📧 Email System

Automated email notifications include:
- RSVP confirmation emails with event details
- Beautiful HTML templates with wedding branding
- Queue support for bulk email processing
- Customizable email templates

## 🔐 Security Features

- Laravel Sanctum API authentication
- CORS configuration for secure frontend-backend communication
- Input validation and sanitization
- File upload security with type checking
- Rate limiting on API endpoints
- SQL injection protection via Eloquent ORM

## 🚀 Production Deployment

### Docker Deployment
```bash
# Build and start production containers
docker-compose --profile production up -d

# Or deploy individual services
docker build -t wedding-backend ./backend
docker build -t wedding-frontend ./frontend
```

### Manual Deployment
1. Configure production environment variables
2. Set up database (MySQL/PostgreSQL)
3. Configure web server (Nginx/Apache)
4. Set up SSL certificates
5. Configure email service (SendGrid/SES)
6. Set up monitoring and logging

## 📈 Performance Features

- Next.js static generation for fast page loads
- Image optimization and lazy loading
- Database query optimization
- Redis caching for sessions and data
- CDN-ready static asset delivery
- Gzip compression and minification

## 🤝 Contributing

This is a complete wedding website platform ready for customization. To extend functionality:

1. Add new API endpoints in Laravel controllers
2. Create corresponding frontend components
3. Update navigation and routing
4. Add tests for new features
5. Update documentation

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with modern web technologies and best practices:
- Laravel for robust backend API
- Next.js for performant frontend
- Tailwind CSS for beautiful styling
- Docker for consistent deployment
- GitHub Actions for automated workflows

---

**Ready for your special day! 💕**