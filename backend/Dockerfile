# Laravel Backend Dockerfile - Multi-stage Production Build
# Stage 1: Build stage
FROM php:8.2-fpm-alpine AS builder

# Install system dependencies for building
RUN apk add --no-cache --virtual .build-deps \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite-dev \
    postgresql-dev \
    mysql-dev \
    $PHPIZE_DEPS \
    && apk add --no-cache \
    libpng \
    libxml2 \
    sqlite \
    postgresql-libs \
    mysql-client

# Install PHP extensions
RUN docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_sqlite \
    pdo_pgsql \
    pdo_mysql \
    gd \
    xml \
    bcmath \
    opcache

# Install and configure OPcache
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.enable_cli=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies with optimizations
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --no-ansi \
    --prefer-dist \
    && composer clear-cache

# Copy application code
COPY . .

# Generate optimized autoloader and cache configurations
RUN composer dump-autoload --optimize \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Clean up build dependencies
RUN apk del .build-deps

# Stage 2: Production stage
FROM php:8.2-fpm-alpine AS production

# Install only runtime dependencies
RUN apk add --no-cache \
    libpng \
    libxml2 \
    sqlite \
    postgresql-libs \
    mysql-client \
    nginx \
    supervisor \
    curl

# Install PHP extensions (runtime only)
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/

# Enable extensions
RUN docker-php-ext-enable \
    pdo \
    pdo_sqlite \
    pdo_pgsql \
    pdo_mysql \
    gd \
    xml \
    bcmath \
    opcache

# Create application user
RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -S www -G www

# Set working directory
WORKDIR /var/www/html

# Copy built application from builder stage
COPY --from=builder --chown=www:www /var/www/html .

# Set proper permissions
RUN chown -R www:www /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create required directories
RUN mkdir -p /var/log/supervisor /var/log/nginx \
    && touch /var/www/html/database/database.sqlite \
    && chown www:www /var/www/html/database/database.sqlite

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Expose port
EXPOSE 8000

# Use the entrypoint script
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Default command
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]