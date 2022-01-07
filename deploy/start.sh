#!/usr/bin/env sh

export ASSISTED_SERVICE_URL="${ASSISTED_SERVICE_URL:-http://localhost:8090}"

envsubst '$ASSISTED_SERVICE_URL $NGINX_APP_ROOT' < /deploy/nginx.conf > "$NGINX_CONFIGURATION_PATH/nginx.conf"

exec nginx -g "daemon off;"
