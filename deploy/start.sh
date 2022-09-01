#!/usr/bin/env sh

export ASSISTED_SERVICE_URL="${ASSISTED_SERVICE_URL:-http://localhost:8090}"

envsubst '$ASSISTED_SERVICE_URL' < /deploy/nginx.conf > "$NGINX_DEFAULT_CONF_PATH/nginx.conf"

# Do not listen on IPv6 if it's not enabled in the hardware
if grep 'ipv6.disable=1' /proc/cmdline; then
    cp "${NGINX_CONF_PATH}" ~/nginx.conf.orig
    sed -e 's/listen\s*\[::\].*//g' ~/nginx.conf.orig | dd of="${NGINX_CONF_PATH}"
fi

exec nginx -g "daemon off;"
