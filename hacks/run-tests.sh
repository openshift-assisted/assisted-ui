#!/bin/bash

CYPRESS_BASE_URL=${CYPRESS_BASE_URL:-http://192.168.0.126:3000} # URL of running Metal3 Installer UI
TESTS_IMAGE=${TESTS_IMAGE:-"quay.io/ocpmetal/ocp-metal-ui-tests:latest"}
BASE_DIR=${BASE_DIR:-"`pwd`"/`date +%D_%T|sed 's/\//_/g'|sed 's/:/-/g'`}
CONTAINER_COMMAND=${CONTAINER_COMMAND:-podman}

echo Connecting to UI at: ${CYPRESS_BASE_URL}
echo "    ^^^ If failing, check that the URL can be accessed from inside of the container (i.e. avoid 'localhost')"
echo Test image: ${TESTS_IMAGE}

VIDEO_DIR=${BASE_DIR}/videos
SCREENSHOT_DIR=${BASE_DIR}/screenshots

mkdir -p ${VIDEO_DIR}
mkdir -p ${SCREENSHOT_DIR}

${CONTAINER_COMMAND} run -it \
  -w /e2e \
  -e CYPRESS_BASE_URL="${CYPRESS_BASE_URL}" \
  --security-opt label=disable \
  --mount type=bind,source=${VIDEO_DIR},target=/e2e/cypress/videos \
  --mount type=bind,source=${SCREENSHOT_DIR},target=/e2e/cypress/screenshots \
  --pull always \
  "${TESTS_IMAGE}"

echo Screenshots and videos can be found in ${BASE_DIR}

