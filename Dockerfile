FROM bitnami/nginx:1.18.0

COPY deploy/deploy_config.sh /deploy/
COPY deploy/ocp-metal-ui-template.yaml /deploy/

COPY build/ /app/