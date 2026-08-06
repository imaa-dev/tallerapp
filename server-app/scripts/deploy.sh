#!/bin/bash

set -e

APP_DIR="/var/www/html/tallerapp/server-app"

cd "$APP_DIR"

echo "Actualizando código..."
git pull origin develop

echo "Instalando dependencias PHP..."
composer install --no-dev --optimize-autoloader

echo "Migraciones..."
php artisan migrate --force

echo "Optimizando Laravel..."
php artisan optimize

echo "Instalando dependencias frontend..."
npm install

echo "Compilando frontend..."
npm run build

echo "Ajustando permisos..."
sudo chown -R www-data:www-data storage bootstrap/cache

echo "Reiniciando Apache..."
sudo systemctl reload apache2

echo "Deploy completado."
