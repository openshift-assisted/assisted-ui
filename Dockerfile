FROM bitnami/nginx:1.18.0

COPY deploy/deploy_config.sh /deploy/
COPY deploy/ui-deployment-template.yaml /deploy/

COPY build/ /app/