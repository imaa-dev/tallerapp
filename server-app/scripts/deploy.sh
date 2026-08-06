#!/bin/bash

set -e

APP_DIR="/var/www/html/tallerapp/server-app"

echo "Actualizando código..."
git pull origin develop

echo "Instalando dependencias..."
composer install --no-dev --optimize-autoloader

echo "Migraciones..."
php artisan migrate --force

echo "Cache..."
php artisan optimize

echo "Compilando frontend..."
npm install
npm run build

echo "Permisos..."
chown -R www-data:www-data storage bootstrap/cache

echo "Reiniciando Apache..."
systemctl reload apache2

echo "Listo."
