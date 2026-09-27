#!/usr/bin/env bash
#
# test-lab-asus.sh - Corre los tests de Laravel (bare-metal) en el servidor
# ASUS. La base de datos de testing se toma de TEST_DATABASE (.env).
#
# Uso:
#   ./scripts/test-lab-asus.sh
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

log()  { printf '%s [test] %b%s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$GREEN" "$*" "$NC"; }
die()  { printf '%s [test] %bERROR: %s%b\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$RED" "$*" "$NC" >&2; exit 1; }

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

main() {
    local test_db db_name

    test_db="${TEST_DATABASE:-$(get_env TEST_DATABASE)}"
    test_db="${test_db:-mybike_test}"

    trap 'die "falló el paso: ${BASH_COMMAND} (exit $?)"' ERR

    log "Limpiando cache Laravel..."
    php artisan optimize:clear

    log "Verificando base de datos de testing..."

    db_name="$(APP_ENV=testing php artisan tinker --execute="echo config('database.connections.mysql.database');")"

    log "Base de datos actual: $db_name"

    if [ "$db_name" != "$test_db" ]; then
        die "Los tests no están usando la base de datos de testing.
Base detectada: $db_name
Esperada: $test_db"
    fi

    log "Base de datos correcta."

    php artisan test

    log "Tests completados."
}

main "$@"