FROM registry.access.redhat.com/ubi8/nginx-120 as app

# persist these on the final image for later inspection
ARG REACT_APP_BUILD_MODE
ENV BUILD_MODE=$REACT_APP_BUILD_MODE
ARG REACT_APP_CLUSTER_PERMISSIONS
ENV CLUSTER_PERMISSIONS=$REACT_APP_CLUSTER_PERMISSIONS
ARG REACT_APP_GIT_SHA
ENV GIT_SHA=$REACT_APP_GIT_SHA
ARG REACT_APP_VERSION
ENV VERSION=$REACT_APP_VERSION

COPY ../deploy/deploy_config.sh /deploy/
COPY ../deploy/ui-deployment-template.yaml /deploy/
COPY ../deploy/nginx.conf /deploy/
COPY ../deploy/start.sh /deploy/

COPY --chown=1001:0 /build/ "${NGINX_APP_ROOT}/src/"

CMD [ "/deploy/start.sh" ]
