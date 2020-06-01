FROM bitnami/nginx:1.17

COPY build/ /app/
COPY deploy/deploy_config.sh /deploy/
COPY deploy/ocp-metal-ui-template.yaml /deploy/
