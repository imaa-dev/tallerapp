#!/usr/bin/env bash

set -e

echo "Limpiando cache Laravel..."

php artisan optimize:clear

echo "Verificando base de datos de testing..."

DB_NAME=$(APP_ENV=testing php artisan tinker --execute="echo config('database.connections.mysql.database');")

echo "Base de datos actual: $DB_NAME"

if [ "$DB_NAME" != "mybike_test" ]; then
    echo "ERROR: Los tests no están usando la base de datos de testing."
    echo "Base detectada: $DB_NAME"
    exit 1
fi

echo "Base de datos correcta."

php artisan test
