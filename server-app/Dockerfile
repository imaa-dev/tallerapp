# ============================================================
# Stage 1: Composer dependencies
# ============================================================

FROM composer:2 AS composer

WORKDIR /var/www/html

COPY . .

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader


# ============================================================
# Stage 2: Frontend build
# ============================================================

FROM node:22-bookworm AS frontend

WORKDIR /var/www/html

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ============================================================
# Stage 3: PHP application
# ============================================================

FROM php:8.3-fpm-bookworm AS app

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        mbstring \
        bcmath \
        exif \
        pcntl \
        intl \
        gd \
        zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# PHP production configuration

RUN mv "$PHP_INI_DIR/php.ini-production" \
    "$PHP_INI_DIR/php.ini"


# Application source

COPY . .


# Composer dependencies

COPY --from=composer \
    /var/www/html/vendor \
    /var/www/html/vendor


# Compiled frontend

COPY --from=frontend \
    /var/www/html/public/build \
    /var/www/html/public/build


# Laravel directories

RUN mkdir -p \
    bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs


# Permissions

RUN chown -R www-data:www-data \
    bootstrap/cache \
    storage

RUN chmod -R 775 \
    bootstrap/cache \
    storage


USER www-data

EXPOSE 9000

CMD ["php-fpm"]


# ============================================================
# Stage 4: Nginx
# ============================================================

FROM nginx:1.27-alpine AS nginx

COPY docker/nginx/default.conf \
    /etc/nginx/conf.d/default.conf

COPY public \
    /var/www/html/public

COPY --from=frontend \
    /var/www/html/public/build \
    /var/www/html/public/build

# Sirve archivos subidos (volumen `storage`, montado :ro) bajo /storage
RUN ln -s /var/www/html/storage/app/public \
    /var/www/html/public/storage

WORKDIR /var/www/html/public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]