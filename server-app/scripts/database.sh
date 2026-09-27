#!/usr/bin/env bash
#
# database.sh - Ejecuta las migraciones de Laravel sobre el stack Docker
# en un VPS EC2 de AWS. Debe correrse ANTES de levantar la nueva versión
# de la app (nginx/app/queue/scheduler) para que el código nuevo nunca
# sirva tráfico con un esquema de BD desactualizado.
#
# Uso:
#   ./scripts/database.sh
#
# Variables de entorno (todas opcionales):
#   BACKUP_ENABLED    crea backup previo a migrar (1/0)    [default: 1]
#   BACKUP_RETENTION  días que se conservan los backups    [default: 7]
#   BACKUP_DIR        carpeta de backups                   [default: /var/backups/tallerapp/db]
#   MAINTENANCE       modo mantenimiento durante migración [default: 0]
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

ENV_FILE="$PROJECT_DIR/.env"
COMPOSE_FILE="$PROJECT_DIR/compose.yml"
COMPOSE="sudo docker compose -f $COMPOSE_FILE"
LOCK_FILE="/tmp/tallerapp-db-deploy.lock"

BACKUP_ENABLED="${BACKUP_ENABLED:-1}"
BACKUP_RETENTION="${BACKUP_RETENTION:-7}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/tallerapp/db}"
MAINTENANCE="${MAINTENANCE:-0}"

MYSQL_MAX_ATTEMPTS="${MYSQL_MAX_ATTEMPTS:-30}"
MYSQL_ATTEMPT_INTERVAL="${MYSQL_ATTEMPT_INTERVAL:-3}"

MAINTENANCE_ACTIVATED=0

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
              -e "s/^'//" -e "s/'$//"
}

on_error() {
    local status=$?
    printf '%s [deploy] %bERROR: falló el paso: "%s" (exit %d)%b\n' \
        "$(date '+%Y-%m-%d %H:%M:%S')" "$RED" "$BASH_COMMAND" "$status" "$NC" >&2
}

exit_maintenance() {
    if [ "$MAINTENANCE_ACTIVATED" = "1" ]; then
        warn "Saliendo del modo mantenimiento..."
        $COMPOSE run --rm --no-deps app php artisan up \
            || warn "No se pudo salir del modo mantenimiento"
        MAINTENANCE_ACTIVATED=0
    fi
}

run_backup() {
    local backup_file

    log "Creando backup de la base de datos..."
    if [ ! -d "$BACKUP_DIR" ]; then
        sudo mkdir -p "$BACKUP_DIR" \
            || die "No se pudo crear el directorio de backups: $BACKUP_DIR"
    fi

    backup_file="$BACKUP_DIR/tallerapp_$(date +%Y%m%d_%H%M%S).sql.gz"

    $COMPOSE exec -T mysql \
        mysqldump -h localhost -u root -p"$DB_ROOT_PASSWORD" \
            --single-transaction --routines --triggers "$DB_DATABASE" \
        | gzip \
        | sudo tee "$backup_file" >/dev/null

    if ! sudo test -s "$backup_file"; then
        die "El backup generado está vacío: $backup_file"
    fi

    log "Backup creado: $backup_file"

    sudo find "$BACKUP_DIR" -maxdepth 1 -type f \
        -name 'tallerapp_*.sql.gz' -mtime "+$BACKUP_RETENTION" -delete \
        || warn "No se pudo limpiar backups antiguos"
}

main() {
    local attempt pending

    trap on_error ERR
    trap exit_maintenance EXIT

    if [ ! -f "$ENV_FILE" ]; then
        die "No se encontró .env en $PROJECT_DIR"
    fi

    if [ ! -f "$COMPOSE_FILE" ]; then
        die "No se encontró compose.yml en $PROJECT_DIR"
    fi
    
    DB_ROOT_PASSWORD="$(get_env DB_ROOT_PASSWORD)"
    DB_DATABASE="$(get_env DB_DATABASE)"

    log "DB_DATABASE configurada: ${DB_DATABASE}"
    log "DB_ROOT_PASSWORD configurada: $([ -n "$DB_ROOT_PASSWORD" ] && echo "SI" || echo "NO")"
    log "DB_ROOT_PASSWORD length: ${#DB_ROOT_PASSWORD}"

    if [ -z "$DB_ROOT_PASSWORD" ] || [ -z "$DB_DATABASE" ]; then
        die "Faltan variables obligatorias en .env: DB_ROOT_PASSWORD, DB_DATABASE"
    fi

    log "======================================"
    log "TallerApp - Database deployment"
    log "======================================"

    log "Adquiriendo bloqueo (evita migraciones concurrentes)..."
    exec 9>"$LOCK_FILE"
    if ! flock -n 9; then
        die "Otra instancia de la migración está en ejecución. Abortando."
    fi

    log "Verificando el stack Docker..."
    if [ -z "$($COMPOSE ps -q mysql 2>/dev/null)" ]; then
        warn "MySQL no está corriendo. Levantando mysql y redis..."
        $COMPOSE up -d mysql redis
    fi

    log "Esperando a que MySQL esté disponible..."
    attempt=1
    until $COMPOSE exec -T mysql \
        mysqladmin ping -h localhost -u root -p"$DB_ROOT_PASSWORD" --silent >/dev/null 2>&1; do
        if [ "$attempt" -ge "$MYSQL_MAX_ATTEMPTS" ]; then
            die "MySQL no respondió tras $MYSQL_MAX_ATTEMPTS intentos ($((MYSQL_MAX_ATTEMPTS * MYSQL_ATTEMPT_INTERVAL))s)."
        fi
        attempt=$((attempt + 1))
        sleep "$MYSQL_ATTEMPT_INTERVAL"
    done
    log "MySQL disponible."

    if [ "$BACKUP_ENABLED" = "1" ]; then
        run_backup
    fi

    if [ "$MAINTENANCE" = "1" ]; then
        log "Activando modo mantenimiento..."
        $COMPOSE run --rm --no-deps app php artisan down --retry=15
        MAINTENANCE_ACTIVATED=1
    fi

    log "Ejecutando migraciones..."
    $COMPOSE run --rm migrate php artisan migrate --force --step

    log "Verificando que no queden migraciones pendientes..."
    pending="$($COMPOSE run --rm migrate php artisan migrate:status | grep -cE 'Pending' || true)"
    if [ "$pending" -gt 0 ]; then
        die "Quedan $pending migración(es) pendiente(s). Revisa 'migrate:status'."
    fi

    exit_maintenance

    log "Migraciones completadas."
    log "======================================"
    log "Database deployment completado."
    log "======================================"
}

main "$@"