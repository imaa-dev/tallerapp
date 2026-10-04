#!/usr/bin/env bash
#
# ============================================================
# redeploy-env.sh
# ============================================================
#
# Reaplica cambios del .env sobre el stack Docker existente.
#
# NO hace:
#   - git pull
#   - checkout de ramas
#   - docker build
#
# SÍ hace:
#   - conserva la versión actualmente desplegada
#   - valida Compose
#   - recrea app
#   - espera app healthy
#   - recrea queue/scheduler
#   - ejecuta database.sh
#   - ejecuta laravel.sh
#   - recrea nginx AL FINAL
#   - valida DNS nginx -> app
#   - valida app:9000
#   - valida HTTP
#
# Uso:
#
#   ./scripts/redeploy-env.sh
#
# ============================================================

set -Eeuo pipefail

# ============================================================
# Paths
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

# ============================================================
# Configuración
# ============================================================

COMPOSE_FILE="${COMPOSE_FILE:-compose.prod.yml}"

APP_CONTAINER="${APP_CONTAINER:-tallerapp-app}"
NGINX_CONTAINER="${NGINX_CONTAINER:-tallerapp-nginx}"
MYSQL_CONTAINER="${MYSQL_CONTAINER:-tallerapp-mysql}"
REDIS_CONTAINER="${REDIS_CONTAINER:-tallerapp-redis}"

HEALTH_RETRIES="${HEALTH_RETRIES:-30}"
HEALTH_INTERVAL="${HEALTH_INTERVAL:-5}"

LOCK_FILE="/tmp/tallerapp-redeploy-env.lock"

# ============================================================
# Logging
# ============================================================

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [redeploy-env] $*"
}

warn() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [redeploy-env] WARNING: $*" >&2
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
# Error handling
# ============================================================

on_error() {
    local exit_code=$?

    error "El redeploy de .env falló."

    echo
    error "Estado actual:"
    sudo docker compose \
        -f "$COMPOSE_FILE" \
        ps || true

    echo
    error "Últimos logs de APP:"
    sudo docker logs \
        --tail=80 \
        "$APP_CONTAINER" || true

    echo
    error "Últimos logs de NGINX:"
    sudo docker logs \
        --tail=80 \
        "$NGINX_CONTAINER" || true

    echo
    error "El script NO ejecutará docker compose down."
    error "Los contenedores existentes se mantienen."

    exit "$exit_code"
}

trap on_error ERR

# ============================================================
# Lock
# ============================================================

if [[ -e "$LOCK_FILE" ]]; then
    error "ya existe otro redeploy ejecutándose."
    error "Lock: $LOCK_FILE"
    exit 1
fi

touch "$LOCK_FILE"

# ============================================================
# Inicio
# ============================================================

log "============================================================"
log "TallerApp - Redeploy de configuración"
log "============================================================"

log "PROJECT_DIR:  $PROJECT_DIR"
log "COMPOSE_FILE: $COMPOSE_FILE"

# ============================================================
# Validaciones
# ============================================================

if [[ ! -f ".env" ]]; then
    error "No existe .env en:"
    error "$PROJECT_DIR/.env"
    exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
    error "No existe:"
    error "$PROJECT_DIR/$COMPOSE_FILE"
    exit 1
fi

# ============================================================
# Obtener APP_VERSION actual
# ============================================================

log "Detectando versión actualmente desplegada..."

CURRENT_IMAGE="$(
    sudo docker inspect "$APP_CONTAINER" \
        --format '{{.Config.Image}}' \
        2>/dev/null || true
)"

if [[ -z "$CURRENT_IMAGE" ]]; then
    error "No existe el contenedor $APP_CONTAINER."
    error "Este script requiere un deployment existente."
    exit 1
fi

APP_VERSION="${CURRENT_IMAGE##*:}"

if [[ -z "$APP_VERSION" || "$APP_VERSION" == "$CURRENT_IMAGE" ]]; then
    error "No se pudo determinar APP_VERSION."
    error "Imagen: $CURRENT_IMAGE"
    exit 1
fi

export APP_VERSION

log "Imagen actualmente desplegada:"
log "  $CURRENT_IMAGE"

log "APP_VERSION:"
log "  $APP_VERSION"

# ============================================================
# Compose wrapper
# ============================================================
#
# IMPORTANTE:
# APP_VERSION se pasa SIEMPRE explícitamente.
#
# Esto evita:
#
# WARN[0000] The "APP_VERSION" variable is not set.
#
# ============================================================

compose() {
    APP_VERSION="$APP_VERSION" \
        sudo -E docker compose \
        -f "$COMPOSE_FILE" \
        "$@"
}

# ============================================================
# Validar Compose
# ============================================================

log "Validando configuración Compose..."

compose config >/dev/null

log "Compose válido."

# ============================================================
# BUILD
# ============================================================

log "============================================================"
log "Construyendo imágenes con las variables VITE_* actuales"
log "============================================================"

log "VITE_APP_NAME: ${VITE_APP_NAME:-<no definido>}"
log "VITE_APP_URL:  ${VITE_APP_URL:-<no definido>}"

compose build app nginx

log "Build completado."

# ============================================================
# Verificar infraestructura
# ============================================================

wait_for_healthy() {

    local container="$1"
    local retries="$2"

    for ((i=1; i<=retries; i++)); do

        local status

        status="$(
            sudo docker inspect "$container" \
                --format '{{.State.Health.Status}}' \
                2>/dev/null || true
        )"

        log "$container health: ${status:-unknown} ($i/$retries)"

        if [[ "$status" == "healthy" ]]; then
            return 0
        fi

        if [[ "$status" == "unhealthy" ]]; then
            return 1
        fi

        sleep "$HEALTH_INTERVAL"
    done

    return 1
}

log "Verificando MySQL..."

if ! sudo docker inspect "$MYSQL_CONTAINER" >/dev/null 2>&1; then
    error "No existe $MYSQL_CONTAINER."
    exit 1
fi

if ! wait_for_healthy "$MYSQL_CONTAINER" "$HEALTH_RETRIES"; then
    error "MySQL no está healthy."
    exit 1
fi

log "MySQL healthy."

log "Verificando Redis..."

if ! sudo docker inspect "$REDIS_CONTAINER" >/dev/null 2>&1; then
    error "No existe $REDIS_CONTAINER."
    exit 1
fi

if ! wait_for_healthy "$REDIS_CONTAINER" "$HEALTH_RETRIES"; then
    error "Redis no está healthy."
    exit 1
fi

log "Redis healthy."

# ============================================================
# APP
# ============================================================

log "============================================================"
log "Recreando APP"
log "============================================================"

compose up -d --force-recreate app

if ! wait_for_healthy "$APP_CONTAINER" "$HEALTH_RETRIES"; then

    error "APP no llegó a healthy."

    sudo docker logs \
        --tail=100 \
        "$APP_CONTAINER" || true

    exit 1
fi

log "APP healthy."

# ============================================================
# Obtener IP actual de APP
# ============================================================

APP_IP="$(
    sudo docker inspect "$APP_CONTAINER" \
        --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
)"

log "IP actual de APP: $APP_IP"

# ============================================================
# QUEUE
# ============================================================

log "Recreando queue..."

compose up -d --force-recreate queue

# ============================================================
# SCHEDULER
# ============================================================

log "Recreando scheduler..."

compose up -d --force-recreate scheduler

# ============================================================
# DATABASE
# ============================================================

log "============================================================"
log "Ejecutando database.sh"
log "============================================================"

"$SCRIPT_DIR/database.sh"

log "database.sh completado."

# ============================================================
# LARAVEL
# ============================================================

log "============================================================"
log "Ejecutando laravel.sh"
log "============================================================"

"$SCRIPT_DIR/laravel.sh"

log "laravel.sh completado."

# ============================================================
# IMPORTANTE:
#
# Nginx se recrea SOLAMENTE después de que APP ya está estable.
#
# Esto fuerza a que Nginx vuelva a resolver:
#
#     app -> IP actual
#
# ============================================================

log "============================================================"
log "Recreando NGINX"
log "============================================================"

compose up -d --force-recreate nginx

# ============================================================
# Esperar NGINX
# ============================================================

if ! wait_for_healthy "$NGINX_CONTAINER" "$HEALTH_RETRIES"; then

    error "NGINX no llegó a healthy."

    sudo docker logs \
        --tail=100 \
        "$NGINX_CONTAINER" || true

    exit 1
fi

log "NGINX healthy."

# ============================================================
# Verificar DNS Docker
# ============================================================

log "Verificando DNS desde Nginx..."

APP_DNS="$(
    sudo docker exec "$NGINX_CONTAINER" \
        getent hosts app \
        2>/dev/null || true
)"

if [[ -z "$APP_DNS" ]]; then
    error "Nginx no puede resolver 'app'."
    exit 1
fi

log "Resolución Docker:"
log "  $APP_DNS"

RESOLVED_APP_IP="$(echo "$APP_DNS" | awk 'NR==1 {print $1}')"

if [[ "$RESOLVED_APP_IP" != "$APP_IP" ]]; then

    error "La IP resuelta por Nginx no coincide con la IP actual de APP."

    error "APP actual:       $APP_IP"
    error "Nginx resolvió:   $RESOLVED_APP_IP"

    exit 1
fi

log "DNS correcto:"
log "  nginx -> app -> $APP_IP"

# ============================================================
# Verificar PHP-FPM
# ============================================================

log "Verificando conexión nginx -> app:9000..."

if ! sudo docker exec "$NGINX_CONTAINER" \
    sh -c 'nc -z app 9000' >/dev/null 2>&1; then

    error "Nginx no puede conectar con app:9000."

    error "DNS:"
    sudo docker exec "$NGINX_CONTAINER" \
        getent hosts app || true

    error "APP:"
    sudo docker inspect "$APP_CONTAINER" \
        --format '{{.State.Status}} {{.State.Health.Status}}' || true

    exit 1
fi

log "Conexión PHP-FPM OK."

# ============================================================
# Verificar configuración FastCGI
# ============================================================

log "Verificando configuración FastCGI..."

FASTCGI_TARGET="$(
    sudo docker exec "$NGINX_CONTAINER" \
        nginx -T 2>/dev/null |
        awk '$1 == "fastcgi_pass" {print $2}' |
        head -n1 |
        tr -d ';'
)"

if [[ "$FASTCGI_TARGET" != "app:9000" ]]; then

    error "Configuración FastCGI inesperada:"
    error "  $FASTCGI_TARGET"

    error "Se esperaba:"
    error "  app:9000"

    exit 1
fi

log "FastCGI correcto: app:9000"

# ============================================================
# HTTP
# ============================================================

log "============================================================"
log "Prueba HTTP"
log "============================================================"

HTTP_STATUS="$(
    curl \
        --silent \
        --show-error \
        --output /dev/null \
        --write-out '%{http_code}' \
        --max-time 15 \
        http://localhost || true
)"

if [[ "$HTTP_STATUS" != "200" ]]; then

    error "HTTP healthcheck falló."
    error "HTTP status: $HTTP_STATUS"

    echo
    error "Estado del stack:"

    compose ps

    echo
    error "Logs Nginx:"

    sudo docker logs \
        --tail=100 \
        "$NGINX_CONTAINER" || true

    exit 1
fi

log "HTTP OK: $HTTP_STATUS"

# ============================================================
# Estado final
# ============================================================

echo

log "============================================================"
log "REDEPLOY COMPLETADO CORRECTAMENTE"
log "============================================================"

log "APP_VERSION: $APP_VERSION"
log "APP IP:      $APP_IP"
log "HTTP:        $HTTP_STATUS"
log "APP:         healthy"
log "NGINX:       healthy"
log "FastCGI:     app:9000"

echo

compose ps

echo

log "============================================================"
log "OK"
log "============================================================"

