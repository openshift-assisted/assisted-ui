FROM registry.access.redhat.com/ubi8/nodejs-16 as builder

ENV NODE_OPTIONS="--max-old-space-size=8192"

ARG REACT_APP_BUILD_MODE
ENV REACT_APP_BUILD_MODE=$REACT_APP_BUILD_MODE
ARG REACT_APP_CLUSTER_PERMISSIONS
ENV REACT_APP_CLUSTER_PERMISSIONS=$REACT_APP_CLUSTER_PERMISSIONS
ARG REACT_APP_GIT_SHA
ENV REACT_APP_GIT_SHA=$REACT_APP_GIT_SHA
ARG REACT_APP_VERSION
ENV REACT_APP_VERSION=$REACT_APP_VERSION

COPY --chown=1001:0 / /src/
RUN chmod 775 /src/
WORKDIR /src/

RUN npm add -g corepack && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

RUN pnpm install && \
    pnpm build

FROM registry.access.redhat.com/ubi8/nginx-120 as app

# persist these on the final image for later inspection
ARG REACT_APP_GIT_SHA
ENV GIT_SHA=$REACT_APP_GIT_SHA
ARG REACT_APP_VERSION
ENV VERSION=$REACT_APP_VERSION

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

COPY deploy/deploy_config.sh /deploy/
COPY deploy/ui-deployment-template.yaml /deploy/
COPY deploy/nginx.conf /deploy/
COPY deploy/nginx_ssl.conf /deploy/
COPY deploy/start.sh /deploy/

COPY --from=builder /src/build/ "${NGINX_APP_ROOT}/src/"

CMD [ "/deploy/start.sh" ]
