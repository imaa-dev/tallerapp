#!/usr/bin/env bash
#
# laravel.sh - Ejecuta la configuración de Laravel (verificación, storage
# link y caches de producción) sobre el stack Docker en un VPS EC2 de AWS.
# Debe correrse cuando el proyecto es levantado, antes de exponer tráfico.
#
# Uso:
#   ./scripts/laravel.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

ENV_FILE="$PROJECT_DIR/.env"
COMPOSE_FILE="$PROJECT_DIR/compose.yml"
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
              -e "s/^'//" -e "s/'$//"
}

on_error() {
    local status=$?
    printf '%s [config] %bERROR: falló el paso: "%s" (exit %d)%b\n' \
        "$(date '+%Y-%m-%d %H:%M:%S')" "$RED" "$BASH_COMMAND" "$status" "$NC" >&2
}

main() {
    local app_key

    trap on_error ERR

    if [ ! -f "$ENV_FILE" ]; then
        die "No se encontró .env en $PROJECT_DIR"
    fi

    if [ ! -f "$COMPOSE_FILE" ]; then
        die "No se encontró compose.yml en $PROJECT_DIR"
    fi

    app_key="$(get_env APP_KEY)"

    if [ -z "$app_key" ]; then
        warn "APP_KEY vacía en .env. Generando APP_KEY..."

        $COMPOSE run --rm --no-deps app php artisan key:generate --force

        app_key="$(get_env APP_KEY)"

        if [ -z "$app_key" ]; then
            die "No fue posible generar APP_KEY en .env"
        fi

        log "APP_KEY generada correctamente."
    else
        log "APP_KEY existente. Se conserva."
    fi

    log "======================================"
    log "TallerApp - Laravel configuration"
    log "======================================"

    log "Adquiriendo bloqueo (evita configuraciones concurrentes)..."
    exec 9>"$LOCK_FILE"
    if ! flock -n 9; then
        die "Otra instancia de la configuración está en ejecución. Abortando."
    fi

    log "Verificando la configuración..."
    $COMPOSE run --rm --no-deps app php artisan about

    log "Creando storage link..."
    $COMPOSE run --rm --no-deps app \
        sh -c '[ -L public/storage ] || php artisan storage:link'

    log "Optimizando Laravel..."
    $COMPOSE run --rm --no-deps app php artisan optimize

    log "Verificando la configuración ya optimizada..."
    $COMPOSE run --rm --no-deps app php artisan about

    log "======================================"
    log "Laravel configurado."
    log "======================================"
}

main "$@"