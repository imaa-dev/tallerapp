#!/usr/bin/env bash
#
# deploy-lab-asus.sh - Despliegue bare-metal (Apache) en el servidor ASUS.
# La ruta del proyecto se toma de DEPLOY_APP_DIR (variable de entorno o .env).
#
# Uso:
#   ./scripts/deploy-lab-asus.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env"

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

log()  { printf '%s [deploy] %b%s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$GREEN" "$*" "$NC"; }
warn() { printf '%s [deploy] %b%s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$YELLOW" "$*" "$NC"; }
die()  { printf '%s [deploy] %bERROR: %s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$RED" "$*" "$NC" >&2; exit 1; }

get_env() {
    local key="$1"
    [ -f "$ENV_FILE" ] || return 0
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
    printf '%s [deploy] %bERROR: falló el paso: "%s" (exit %d)%b\n' \
        "$(date '+%Y-%m-%d %H:%M:%S')" "$RED" "$BASH_COMMAND" "$status" "$NC" >&2
}

main() {
    local app_dir

    trap on_error ERR

    app_dir="${DEPLOY_APP_DIR:-$(get_env DEPLOY_APP_DIR)}"

    if [ -z "$app_dir" ]; then
        die "DEPLOY_APP_DIR no definido (variable de entorno o .env)."
    fi

    if [ ! -d "$app_dir" ]; then
        die "El directorio $app_dir no existe."
    fi

    cd "$app_dir"

    log "======================================"
    log "TallerApp - Deploy Lab ASUS"
    log "======================================"

    log "Actualizando código..."
    git pull origin develop

    log "Instalando dependencias PHP..."
    composer install --no-dev --optimize-autoloader

    log "Migraciones..."
    php artisan migrate --force

    log "Optimizando Laravel..."
    php artisan optimize

    log "Instalando dependencias frontend..."
    npm install

    log "Compilando frontend..."
    npm run build

    log "Ajustando permisos..."
    sudo chown -R www-data:www-data storage bootstrap/cache

    log "Reiniciando Apache..."
    sudo systemctl reload apache2

    log "======================================"
    log "Deploy completado."
    log "======================================"
}

main "$@"