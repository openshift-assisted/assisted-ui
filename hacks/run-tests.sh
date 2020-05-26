#!/bin/bash

CYPRESS_BASE_URL=${CYPRESS_BASE_URL:-http://192.168.0.126:3000} # URL of running Metal3 Installer UI
TEST_IMAGE=${TEST_IMAGE:-"quay.io/mareklibra/facet-tests:123"}
BASE_DIR=${BASE_DIR:-"`pwd`"/`date +%D_%T|sed 's/\//_/g'|sed 's/:/-/g'`}

echo Connecting to UI at: ${CYPRESS_BASE_URL}
echo Test image: ${TEST_IMAGE}

VIDEO_DIR=${BASE_DIR}/videos
SCREENSHOT_DIR=${BASE_DIR}/screenshots

mkdir -p ${VIDEO_DIR}
mkdir -p ${SCREENSHOT_DIR}
docker run -it \
  -w /e2e \
  -e CYPRESS_BASE_URL="${CYPRESS_BASE_URL}" \
  --mount type=bind,source=${VIDEO_DIR},target=/e2e/cypress/videos \
  --mount type=bind,source=${SCREENSHOT_DIR},target=/e2e/cypress/screenshots \
   "${TEST_IMAGE}"

echo Screenshots and videos can be found in ${BASE_DIR}

