#!/usr/bin/env bash
#
# laravel.sh - Ejecuta la configuración de Laravel sobre el stack Docker.
#
# Uso:
#   ./scripts/laravel.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

ENV_FILE="$PROJECT_DIR/.env"
COMPOSE_FILE="$PROJECT_DIR/compose.prod.yml"
COMPOSE="sudo -E docker compose -f $COMPOSE_FILE"
LOCK_FILE="/tmp/tallerapp-laravel-config.lock"

if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    NC=''
fi

log()  { printf '%s [config] %b%s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$GREEN" "$*" "$NC"; }
warn() { printf '%s [config] %b%s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$YELLOW" "$*" "$NC"; }
die()  { printf '%s [config] %bERROR: %s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$RED" "$*" "$NC" >&2; exit 1; }

get_env() {
    local key="$1"

    grep -E "^${key}=" "$ENV_FILE" \
        | head -n 1 \
        | cut -d= -f2- \
        | sed -e 's/\r$//' \
              -e 's/^[[:space:]]*//' \
              -e 's/[[:space:]]*$//' \
              -e 's/^"//' -e 's/"$//' \
              -e "s/^'//" -e "s/'$//" \
        || true
}

set_env() {
    local key="$1"
    local value="$2"

    if grep -qE "^${key}=" "$ENV_FILE"; then
        sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
    else
        printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
    fi
}

on_error() {
    local status=$?

    printf '%s [config] %bERROR: falló el paso: "%s" (exit %d)%b\n' \
        "$(date '+%Y-%m-%d %H:%M:%S')" \
        "$RED" \
        "$BASH_COMMAND" \
        "$status" \
        "$NC" >&2
}

main() {
    local app_key generated_key

    trap on_error ERR

    if [ ! -f "$ENV_FILE" ]; then
        die "No se encontró .env en $PROJECT_DIR"
    fi

    if [ ! -f "$COMPOSE_FILE" ]; then
        die "No se encontró compose.yml en $PROJECT_DIR"
    fi

    # ==========================================================
    # APP_KEY
    # ==========================================================

    log "Verificando APP_KEY..."

    app_key="$(get_env APP_KEY)"

    if [ -z "$app_key" ]; then
        warn "APP_KEY vacía en .env. Generando APP_KEY..."

        generated_key="base64:$(openssl rand -base64 32 | tr -d '\n')"

        set_env APP_KEY "$generated_key"

        app_key="$(get_env APP_KEY)"

        if [ -z "$app_key" ]; then
            die "No fue posible guardar APP_KEY en .env"
        fi

        log "APP_KEY generada correctamente."
    else
        log "APP_KEY existente. Se conserva."
    fi

    # ==========================================================
    # Lock
    # ==========================================================

    log "======================================"
    log "TallerApp - Laravel configuration"
    log "======================================"

    log "Adquiriendo bloqueo (evita configuraciones concurrentes)..."

    exec 9>"$LOCK_FILE"

    if ! flock -n 9; then
        die "Otra instancia de la configuración está en ejecución. Abortando."
    fi

    # ==========================================================
    # Laravel configuration
    # ==========================================================

    log "Verificando que el contenedor recibe APP_KEY..."

    $COMPOSE run --rm --no-deps app \
        sh -c 'test -n "$APP_KEY"'

    log "APP_KEY disponible dentro del contenedor."

    log "Verificando la configuración..."

    $COMPOSE run --rm --no-deps app \
        php artisan about

    # El storage link NO se crea aquí.
    #
    # La imagen Nginx lo crea durante el build:
    #
    # RUN ln -s /var/www/html/storage/app/public \
    #     /var/www/html/public/storage
    #
    # La aplicación PHP no necesita ejecutar php artisan storage:link.

    log "Storage link gestionado por la imagen Nginx."

    log "Optimizando Laravel..."

    $COMPOSE run --rm --no-deps app \
        php artisan optimize

    log "Verificando la configuración ya optimizada..."

    $COMPOSE run --rm --no-deps app \
        php artisan about

    log "======================================"
    log "Laravel configurado."
    log "======================================"
}

main "$@"

