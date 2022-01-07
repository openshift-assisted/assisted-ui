FROM registry.access.redhat.com/ubi8/nodejs-14 as builder

ENV NODE_OPTIONS=--max-old-space-size=8192

ARG REACT_APP_GIT_SHA
ENV REACT_APP_GIT_SHA=$REACT_APP_GIT_SHA
ARG REACT_APP_VERSION
ENV REACT_APP_VERSION=$REACT_APP_VERSION

COPY --chown=1001:0 / /src/
RUN chmod 775 /src/
WORKDIR /src/

RUN npx yarn install
RUN npx yarn lint
RUN npx yarn build

FROM registry.access.redhat.com/ubi8/nginx-120

# persist these on the final image for later inspection
ARG REACT_APP_GIT_SHA
ENV GIT_SHA=$REACT_APP_GIT_SHA
ARG REACT_APP_VERSION
ENV VERSION=$REACT_APP_VERSION

COPY deploy/deploy_config.sh /deploy/
COPY deploy/ui-deployment-template.yaml /deploy/
COPY deploy/nginx.conf /deploy/
COPY deploy/start.sh /deploy/

COPY --from=builder /src/build/ "${NGINX_APP_ROOT}/src/"

CMD [ "/deploy/start.sh" ]
