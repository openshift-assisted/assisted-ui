#!/bin/bash

TESTS_IMAGE=${TESTS_IMAGE:-"quay.io/ocpmetal/ocp-metal-ui-tests:latest"}
BASE_DIR=${BASE_DIR:-"`pwd`"/`date +%D_%T|sed 's/\//_/g'|sed 's/:/-/g'`}
CONTAINER_COMMAND=${CONTAINER_COMMAND:-podman}

CYPRESS_BASE_URL=${CYPRESS_BASE_URL:-http://set.env.variables.before.executing.tests}

echo Connecting to UI at: ${CYPRESS_BASE_URL}
echo "    ^^^ If failing, check that the URL can be accessed from inside of the container (i.e. avoid 'localhost')"
echo API URL: ${CYPRESS_API_BASE_URL}
echo Test image: ${TESTS_IMAGE}

VIDEO_DIR=${BASE_DIR}/videos
SCREENSHOT_DIR=${BASE_DIR}/screenshots

mkdir -p ${VIDEO_DIR}
mkdir -p ${SCREENSHOT_DIR}

set -ex
# TODO(mlibra): Refactor to use an env file shared by hacks/cypress_env_*.sh scripts
echo TODO: Fix passing CYPRESS_PULL_SECRET env variable, all related tests are failing

${CONTAINER_COMMAND} run -it \
  -w /e2e \
  -e CYPRESS_BASE_URL \
  -e CYPRESS_API_BASE_URL \
  -e CYPRESS_SSH_PUB_KEY \
  -e CYPRESS_CLUSTER_NAME \
  -e CYPRESS_CLUSTER_HOSTNAME_MASTER_PREFIX \
  -e CYPRESS_CLUSTER_HOSTNAME_WORKER_PREFIX \
  -e CYPRESS_PULL_SECRET \
  -e CYPRESS_ISO_PATTERN \
  -e CYPRESS_API_VIP \
  -e CYPRESS_INGRESS_VIP \
  -e CYPRESS_NUM_MASTERS \
  -e CYPRESS_NUM_WORKERS \
  --security-opt label=disable \
  --mount type=bind,source=${VIDEO_DIR},target=/e2e/cypress/videos \
  --mount type=bind,source=${SCREENSHOT_DIR},target=/e2e/cypress/screenshots \
  --pull always \
  "${TESTS_IMAGE}" "$@"

echo Screenshots and videos can be found in ${BASE_DIR}

