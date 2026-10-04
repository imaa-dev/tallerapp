#!/usr/bin/env bash
#
# redeploy-env.sh
#
# Reaplica la configuración de .env sobre el stack Docker existente.
#
# NO:
#   - hace git pull
#   - cambia de commit
#   - construye imágenes
#
# SÍ:
#   - valida .env y Compose
#   - detecta la APP_VERSION actualmente desplegada
#   - recrea los servicios de aplicación
#   - ejecuta migrations
#   - reconstruye caches de Laravel
#   - verifica healthcheck
#
# Uso:
#   ./scripts/redeploy-env.sh
#

set -Eeuo pipefail

# ============================================================
# Configuración
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

COMPOSE_FILE="${COMPOSE_FILE:-compose.prod.yml}"
COMPOSE="sudo -E docker compose -f $COMPOSE_FILE"

APP_CONTAINER="${APP_CONTAINER:-tallerapp-app}"
MYSQL_CONTAINER="${MYSQL_CONTAINER:-tallerapp-mysql}"
REDIS_CONTAINER="${REDIS_CONTAINER:-tallerapp-redis}"

LOCK_FILE="/tmp/tallerapp-redeploy-env.lock"

HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_INTERVAL="${HEALTH_INTERVAL:-5}"

# ============================================================
# Logging
# ============================================================

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [redeploy-env] $*"
}

error() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [redeploy-env] ERROR: $*" >&2
}

# ============================================================
# Cleanup
# ============================================================

cleanup() {
    rm -f "$LOCK_FILE"
}

trap cleanup EXIT

# ============================================================
# Error handler
# ============================================================

on_error() {
    local exit_code=$?

    error "falló el redeploy de configuración."
    error "El stack NO será eliminado automáticamente."
    error "Revisa los logs con:"
    error "  sudo docker compose -f $COMPOSE_FILE ps"
    error "  sudo docker compose -f $COMPOSE_FILE logs --tail=100 app"
    error "  sudo docker compose -f $COMPOSE_FILE logs --tail=100 nginx"

    exit "$exit_code"
}

trap on_error ERR

# ============================================================
# Lock
# ============================================================

if [[ -e "$LOCK_FILE" ]]; then
    error "ya existe un redeploy en ejecución."
    error "Lock: $LOCK_FILE"
    exit 1
fi

touch "$LOCK_FILE"

# ============================================================
# Validaciones iniciales
# ============================================================

log "directorio: $PROJECT_DIR"
log "compose: $COMPOSE_FILE"

if [[ ! -f ".env" ]]; then
    error "no existe .env en $PROJECT_DIR"
    exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
    error "no existe $COMPOSE_FILE"
    exit 1
fi

# ============================================================
# Detectar APP_VERSION actualmente desplegada
# ============================================================

log "detectando versión actualmente desplegada..."

CURRENT_IMAGE="$(
    sudo docker inspect "$APP_CONTAINER" \
        --format '{{.Config.Image}}' 2>/dev/null || true
)"

if [[ -z "$CURRENT_IMAGE" ]]; then
    error "no se pudo detectar la imagen de $APP_CONTAINER."
    error "El contenedor debe existir para hacer un redeploy de .env."
    exit 1
fi

APP_VERSION="${CURRENT_IMAGE##*:}"

if [[ -z "$APP_VERSION" || "$APP_VERSION" == "$CURRENT_IMAGE" ]]; then
    error "no se pudo determinar APP_VERSION desde:"
    error "  $CURRENT_IMAGE"
    exit 1
fi

export APP_VERSION

log "imagen actual: $CURRENT_IMAGE"
log "APP_VERSION: $APP_VERSION"

# ============================================================
# Mostrar configuración relevante
# ============================================================

log "configuración que será utilizada:"

$COMPOSE config >/dev/null

log "Compose válido."

# ============================================================
# Comprobar infraestructura
# ============================================================

log "comprobando MySQL..."

if ! sudo docker inspect "$MYSQL_CONTAINER" >/dev/null 2>&1; then
    error "no existe el contenedor $MYSQL_CONTAINER"
    exit 1
fi

MYSQL_STATUS="$(
    sudo docker inspect "$MYSQL_CONTAINER" \
        --format '{{.State.Health.Status}}' 2>/dev/null || true
)"

if [[ "$MYSQL_STATUS" != "healthy" ]]; then
    error "MySQL no está healthy: $MYSQL_STATUS"
    sudo docker inspect "$MYSQL_CONTAINER" \
        --format '{{json .State.Health}}' || true
    exit 1
fi

log "MySQL healthy."

log "comprobando Redis..."

if ! sudo docker inspect "$REDIS_CONTAINER" >/dev/null 2>&1; then
    error "no existe el contenedor $REDIS_CONTAINER"
    exit 1
fi

REDIS_STATUS="$(
    sudo docker inspect "$REDIS_CONTAINER" \
        --format '{{.State.Health.Status}}' 2>/dev/null || true
)"

if [[ "$REDIS_STATUS" != "healthy" ]]; then
    error "Redis no está healthy: $REDIS_STATUS"
    exit 1
fi

log "Redis healthy."

# ============================================================
# Recrear servicios que consumen configuración Laravel
# ============================================================

log "recreando servicios de aplicación..."

$COMPOSE up -d --force-recreate \
    app \
    nginx \
    queue \
    scheduler

log "servicios recreados."

# ============================================================
# Esperar a que app esté healthy
# ============================================================

log "esperando que $APP_CONTAINER esté healthy..."

for ((i=1; i<=HEALTH_RETRIES; i++)); do

    STATUS="$(
        sudo docker inspect "$APP_CONTAINER" \
            --format '{{.State.Health.Status}}' 2>/dev/null || true
    )"

    log "healthcheck app: $STATUS ($i/$HEALTH_RETRIES)"

    if [[ "$STATUS" == "healthy" ]]; then
        break
    fi

    if [[ "$STATUS" == "unhealthy" ]]; then
        error "app quedó unhealthy."

        sudo docker logs \
            --tail=100 \
            "$APP_CONTAINER" || true

        exit 1
    fi

    sleep "$HEALTH_INTERVAL"
done

FINAL_STATUS="$(
    sudo docker inspect "$APP_CONTAINER" \
        --format '{{.State.Health.Status}}' 2>/dev/null || true
)"

if [[ "$FINAL_STATUS" != "healthy" ]]; then
    error "app no llegó a healthy."
    exit 1
fi

log "app healthy."

# ============================================================
# Laravel configuration / cache
# ============================================================

log "aplicando configuración de Laravel..."

"$SCRIPT_DIR/laravel.sh"

log "configuración Laravel aplicada."

# ============================================================
# Migraciones
# ============================================================

log "ejecutando migrations..."

$COMPOSE run --rm migrate \
    php artisan migrate --force --step

log "migrations completadas."

# ============================================================
# Reiniciar app/queue/scheduler después de caches
# ============================================================

log "reiniciando servicios para asegurar configuración actualizada..."

$COMPOSE restart \
    app \
    queue \
    scheduler

# ============================================================
# Healthcheck final
# ============================================================

log "esperando healthcheck final..."

for ((i=1; i<=HEALTH_RETRIES; i++)); do

    STATUS="$(
        sudo docker inspect "$APP_CONTAINER" \
            --format '{{.State.Health.Status}}' 2>/dev/null || true
    )"

    if [[ "$STATUS" == "healthy" ]]; then
        log "app healthy."
        break
    fi

    if [[ "$STATUS" == "unhealthy" ]]; then
        error "healthcheck final falló."

        sudo docker compose \
            -f "$COMPOSE_FILE" \
            ps

        exit 1
    fi

    sleep "$HEALTH_INTERVAL"
done

FINAL_STATUS="$(
    sudo docker inspect "$APP_CONTAINER" \
        --format '{{.State.Health.Status}}' 2>/dev/null || true
)"

if [[ "$FINAL_STATUS" != "healthy" ]]; then
    error "el stack no quedó healthy después del redeploy."
    exit 1
fi

# ============================================================
# Estado final
# ============================================================

log "estado final del stack:"

$COMPOSE ps

log "=========================================="
log "REDEPLOY DE .ENV COMPLETADO"
log "APP_VERSION: $APP_VERSION"
log "=========================================="
