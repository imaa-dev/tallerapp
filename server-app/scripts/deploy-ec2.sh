#!/usr/bin/env bash
#
# deploy-ec2.sh - Despliegue completo en un VPS EC2 de AWS con Docker Compose.
# Orquesta: pull del código -> build de imágenes -> migraciones (database.sh)
# -> configuración de Laravel (laravel.sh) -> levantar stack -> healthcheck.
#
# Orden intencional: las migraciones y la config (caches) corren ANTES de
# levantar la nueva versión, para que el código nuevo nunca sirva tráfico con
# esquema o caches desactualizados.
#
# Uso:
#   ./scripts/deploy-ec2.sh
#
# Variables de entorno / .env:
#   APP_VERSION     (requerido) tag de las imágenes Docker. Ej: git rev-parse --short HEAD
#   DEPLOY_BRANCH   rama a desplegar                     [default: main]
#   HEALTH_RETRIES  reintentos del healthcheck           [default: 30]
#   HEALTH_INTERVAL segundos entre reintentos            [default: 5]
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

ENV_FILE="$PROJECT_DIR/.env"
COMPOSE_FILE="$PROJECT_DIR/compose.prod.yml"
COMPOSE="sudo -E docker compose -f $COMPOSE_FILE"
LOCK_FILE="/tmp/tallerapp-ec2-deploy.lock"

HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_INTERVAL="${HEALTH_INTERVAL:-5}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1/}"

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

on_error() {
    local status=$?
    printf '%s [deploy] %bERROR: falló el paso: "%s" (exit %d)%b\n' \
        "$(date '+%Y-%m-%d %H:%M:%S')" "$RED" "$BASH_COMMAND" "$status" "$NC" >&2
}

main() {
    local app_version branch retries

    trap on_error ERR

    if [ ! -f "$ENV_FILE" ]; then
        die "No se encontró .env en $PROJECT_DIR"
    fi

    if [ ! -f "$COMPOSE_FILE" ]; then
        die "No se encontró compose.yml en $PROJECT_DIR"
    fi

    branch="${DEPLOY_BRANCH:-$(get_env DEPLOY_BRANCH)}"
    branch="${branch:-main}"

    log "======================================"
    log "TallerApp - Deploy EC2 (rama: $branch)"
    log "======================================"

    log "Adquiriendo bloqueo (evita deploys concurrentes)..."
    exec 9>"$LOCK_FILE"

    if ! flock -n 9; then
        die "Otro deploy está en ejecución. Abortando."
    fi

    log "Actualizando código..."
    (
        cd "$PROJECT_DIR"
        sudo git pull --ff-only origin "$branch"
    )

    app_version="$(cd "$PROJECT_DIR" && sudo git rev-parse --short HEAD)"

    if [ -z "$app_version" ]; then
        die "No se pudo determinar APP_VERSION desde Git"
    fi

    export APP_VERSION="$app_version"
    log "Commit desplegado: $APP_VERSION"

    log "Construyendo imágenes (APP_VERSION=$APP_VERSION)..."
    DOCKER_BUILDKIT=1 $COMPOSE build app nginx

    log "Migrando base de datos..."
    "$SCRIPT_DIR/database.sh"

    log "Configurando Laravel..."
    "$SCRIPT_DIR/laravel.sh"

    log "Levantando el stack..."
    $COMPOSE up -d app nginx queue scheduler

    log "Verificando salud de la aplicación ($HEALTH_URL)..."
    retries=0

    until curl -sf --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; do
        retries=$((retries + 1))

        if [ "$retries" -ge "$HEALTH_RETRIES" ]; then
            die "La aplicación no respondió tras $HEALTH_RETRIES intentos. Revisa: $COMPOSE ps"
        fi

        sleep "$HEALTH_INTERVAL"
    done

    log "Aplicación saludable."

    log "Limpiando recursos Docker no usados..."
    sudo docker image prune -f >/dev/null 2>&1 || true
    sudo docker builder prune -f --filter until=168h >/dev/null 2>&1 || true

    log "======================================"
    log "Deploy completado."
    log "Versión: $APP_VERSION"
    log "Rama: $branch"
    log "======================================"

    $COMPOSE ps
}   

main "$@"