#!/usr/bin/env sh

export ASSISTED_SERVICE_URL="${ASSISTED_SERVICE_URL:-http://localhost:8090}"

envsubst '$ASSISTED_SERVICE_URL' < /deploy/nginx.conf > "$NGINX_DEFAULT_CONF_PATH/nginx.conf"

exec nginx -g "daemon off;"
