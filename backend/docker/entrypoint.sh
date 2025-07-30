#!/bin/sh
set -e

echo "🚀 Starting Laravel application..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
fi

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Set database configuration based on environment
if [ "$DB_CONNECTION" = "pgsql" ]; then
    echo "🗄️ Configuring PostgreSQL database..."
    sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=pgsql|" .env
elif [ "$DB_CONNECTION" = "mysql" ]; then
    echo "🗄️ Configuring MySQL database..."
    sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=mysql|" .env
else
    echo "🗄️ Configuring SQLite database..."
    sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=sqlite|" .env
    sed -i "s|DB_DATABASE=.*|DB_DATABASE=/var/www/html/database/database.sqlite|" .env
    
    # Create SQLite database file if it doesn't exist
    if [ ! -f database/database.sqlite ]; then
        touch database/database.sqlite
        chown www:www database/database.sqlite
    fi
fi

# Wait for database to be ready (for PostgreSQL/MySQL)
if [ "$DB_CONNECTION" = "pgsql" ] || [ "$DB_CONNECTION" = "mysql" ]; then
    echo "⏳ Waiting for database to be ready..."
    php artisan migrate:status > /dev/null 2>&1 || {
        echo "🔄 Database not ready, retrying in 5 seconds..."
        sleep 5
    }
fi

# Run database migrations
echo "🔄 Running database migrations..."
php artisan migrate --force

# Clear and cache configurations for production
echo "🧹 Clearing and caching configurations..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

if [ "$APP_ENV" = "production" ]; then
    echo "📦 Caching configurations for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Set proper permissions
echo "🔐 Setting proper permissions..."
chown -R www:www /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

echo "✅ Laravel application is ready!"

# Execute the main command
exec "$@"