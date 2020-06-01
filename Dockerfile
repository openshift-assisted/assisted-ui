FROM nginx:1.17

COPY deploy/deploy_config.sh /deploy/
COPY deploy/ocp-metal-ui-template.yaml /deploy/

COPY build/ /usr/share/nginx/html/

