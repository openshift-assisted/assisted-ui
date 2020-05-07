FROM nginx:1.17

COPY build/ /usr/share/nginx/html
RUN mkdir /deploy
COPY deploy/deploy_config.sh /deploy
COPY deploy/ocp-metal-ui-template.yaml /deploy
