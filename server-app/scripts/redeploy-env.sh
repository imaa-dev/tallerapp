#!/usr/bin/env bash

# ============================================================
# redeploy-env.sh
# ============================================================
#
# Reaplica únicamente el .env sobre el stack Docker existente.
#
# NO hace:
#   - git pull
#   - checkout
#   - docker build
#   - migraciones
#   - seeders
#   - laravel.sh
#   - cambios en MySQL
#   - cambios en Redis
#
# SÍ hace:
#   - conserva las imágenes actualmente desplegadas
#   - obtiene el APP_VERSION actual
#   - valida compose
#   - recrea APP con el .env actual
#   - espera APP healthy
#   - recrea QUEUE
#   - recrea SCHEDULER
#   - recrea NGINX AL FINAL
#   - fuerza a NGINX a resolver nuevamente app
#   - valida nginx -> app:9000
#   - valida HTTP
#
# IMPORTANTE:
#   No se hace "docker compose down".
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
QUEUE_CONTAINER="${QUEUE_CONTAINER:-tallerapp-queue}"
SCHEDULER_CONTAINER="${SCHEDULER_CONTAINER:-tallerapp-scheduler}"

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
    error "No se ejecutará docker compose down."

    exit "$exit_code"
}

trap on_error ERR

# ============================================================
# Lock
# ============================================================

if [[ -e "$LOCK_FILE" ]]; then
    error "Ya existe otro redeploy ejecutándose."
    error "Lock: $LOCK_FILE"
    exit 1
fi

touch "$LOCK_FILE"

# ============================================================
# Inicio
# ============================================================

log "============================================================"
log "TallerApp - Redeploy de .env"
log "============================================================"

log "PROJECT_DIR:  $PROJECT_DIR"
log "COMPOSE_FILE: $COMPOSE_FILE"

# ============================================================
# Validaciones básicas
# ============================================================

if [[ ! -f ".env" ]]; then
    error "No existe .env:"
    error "$PROJECT_DIR/.env"
    exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
    error "No existe:"
    error "$PROJECT_DIR/$COMPOSE_FILE"
    exit 1
fi

# ============================================================
# Obtener imagen actualmente desplegada
# ============================================================

log "Detectando imagen actualmente desplegada..."

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

log "Imagen actual:"
log "  $CURRENT_IMAGE"

log "APP_VERSION:"
log "  $APP_VERSION"

# ============================================================
# Compose wrapper
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
# Mostrar variables relevantes
# ============================================================

log "Configuración .env que será aplicada:"

VITE_APP_NAME_VALUE="$(grep -E '^VITE_APP_NAME=' .env | tail -n1 | cut -d= -f2- || true)"
VITE_APP_URL_VALUE="$(grep -E '^VITE_APP_URL=' .env | tail -n1 | cut -d= -f2- || true)"
APP_ENV_VALUE="$(grep -E '^APP_ENV=' .env | tail -n1 | cut -d= -f2- || true)"
APP_DEBUG_VALUE="$(grep -E '^APP_DEBUG=' .env | tail -n1 | cut -d= -f2- || true)"

log "  APP_ENV=${APP_ENV_VALUE:-<no definido>}"
log "  APP_DEBUG=${APP_DEBUG_VALUE:-<no definido>}"
log "  VITE_APP_NAME=${VITE_APP_NAME_VALUE:-<no definido>}"
log "  VITE_APP_URL=${VITE_APP_URL_VALUE:-<no definido>}"

# ============================================================
# IMPORTANTE
# ============================================================
#
# Este script NO hace build.
#
# Por lo tanto:
#
#   VITE_* dentro de public/build
#
# NO cambian con este script.
#
# Las variables runtime del .env sí serán aplicadas a los
# contenedores mediante env_file.
#
# ============================================================

log "No se realizará ningún docker build."

# ============================================================
# APP
# ============================================================

log "============================================================"
log "Recreando APP con el .env actual"
log "============================================================"

compose up -d --force-recreate --no-deps app

# ============================================================
# Esperar APP
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

if [[ -z "$APP_IP" ]]; then
    error "No se pudo obtener la IP de APP."
    exit 1
fi

log "IP actual de APP:"
log "  $APP_IP"

# ============================================================
# Verificar variables runtime
# ============================================================

log "Verificando variables .env dentro de APP..."

RUNTIME_APP_ENV="$(
    sudo docker exec "$APP_CONTAINER" \
        printenv APP_ENV \
        2>/dev/null || true
)"

if [[ -n "$APP_ENV_VALUE" && "$RUNTIME_APP_ENV" != "$APP_ENV_VALUE" ]]; then
    error "APP_ENV dentro del container no coincide con .env."
    error "Esperado: $APP_ENV_VALUE"
    error "Actual:   $RUNTIME_APP_ENV"
    exit 1
fi

log "APP_ENV aplicado correctamente."

# ============================================================
# QUEUE
# ============================================================

log "============================================================"
log "Recreando QUEUE"
log "============================================================"

compose up -d --force-recreate --no-deps queue

# ============================================================
# SCHEDULER
# ============================================================

log "============================================================"
log "Recreando SCHEDULER"
log "============================================================"

compose up -d --force-recreate --no-deps scheduler

# ============================================================
# NGINX
# ============================================================
#
# MUY IMPORTANTE:
#
# APP fue recreado antes.
#
# Ahora NGINX también se recrea para que sus workers comiencen
# con la resolución DNS actual de:
#
#     app -> IP nueva
#
# Esto evita el problema anterior:
#
#     nginx -> IP antigua de app -> 502
#
# ============================================================

log "============================================================"
log "Recreando NGINX"
log "============================================================"

compose up -d --force-recreate --no-deps nginx

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

log "Verificando DNS nginx -> app..."

APP_DNS="$(
    sudo docker exec "$NGINX_CONTAINER" \
        getent hosts app \
        2>/dev/null || true
)"

if [[ -z "$APP_DNS" ]]; then
    error "NGINX no puede resolver 'app'."
    exit 1
fi

RESOLVED_APP_IP="$(echo "$APP_DNS" | awk 'NR==1 {print $1}')"

log "DNS:"
log "  app -> $RESOLVED_APP_IP"

if [[ "$RESOLVED_APP_IP" != "$APP_IP" ]]; then

    error "NGINX está resolviendo una IP distinta."

    error "APP actual:"
    error "  $APP_IP"

    error "NGINX resolvió:"
    error "  $RESOLVED_APP_IP"

    exit 1
fi

log "DNS correcto:"
log "  nginx -> app -> $APP_IP"

# ============================================================
# Verificar PHP-FPM
# ============================================================

log "Verificando nginx -> app:9000..."

if ! sudo docker exec "$NGINX_CONTAINER" \
    sh -c 'nc -z app 9000' >/dev/null 2>&1; then

    error "NGINX no puede conectar con app:9000."

    error "DNS:"
    sudo docker exec "$NGINX_CONTAINER" \
        getent hosts app || true

    error "APP:"
    sudo docker inspect "$APP_CONTAINER" \
        --format '{{.State.Status}} {{.State.Health.Status}}' || true

    exit 1
fi

log "PHP-FPM OK."

# ============================================================
# Verificar FastCGI
# ============================================================

FASTCGI_TARGET="$(
    sudo docker exec "$NGINX_CONTAINER" \
        nginx -T 2>/dev/null |
        awk '$1 == "fastcgi_pass" {print $2}' |
        head -n1 |
        tr -d ';'
)"

if [[ "$FASTCGI_TARGET" != "app:9000" ]]; then

    error "FastCGI inesperado:"
    error "  $FASTCGI_TARGET"

    error "Esperado:"
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
        http://localhost \
        || true
)"

if [[ "$HTTP_STATUS" != "200" ]]; then

    error "HTTP healthcheck falló."
    error "HTTP status: $HTTP_STATUS"

    echo

    error "Estado del stack:"
    compose ps

    echo

    error "Logs NGINX:"
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
log "REDEPLOY DE .ENV COMPLETADO"
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
