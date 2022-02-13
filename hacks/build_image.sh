#!/usr/bin/env bash
set -e

DOCKERFILE="./Dockerfile"
REACT_APP_BUILD_MODE=""

usage() {
cat << EOF
This command must be executed from the root of the repository
Usage: $0 [-f <dockerfile>] [-s|--single-cluster]
EOF
}

parse_args() {
  while getopts ":f:sh" opt; do
    case $opt in
      h)
        usage
        exit 0
        ;;
      s)
        REACT_APP_BUILD_MODE="single-cluster"
        ;;
      f)
        DOCKERFILE="$OPTARG"
        ;;
      \?)
        echo "Invalid option: -${opt}" >&2
        usage
        exit 1
        ;;
      :)
        echo "Option -$opt requires an argument." >&2
        usage
        exit 1
        ;;
      *)
        usage
        exit 1
        ;;
    esac
  done
}

find_tool() {
  (which podman 2> /dev/null) || (which docker 2> /dev/null)
}

main() {
  parse_args "$@"
  PODMAN=$(find_tool)

  pushd ../assisted-ui-lib
  REACT_APP_GIT_SHA="$(git rev-parse --short HEAD)"
  popd
  REACT_APP_VERSION="$(git rev-parse --short HEAD)"

  if [ "$DOCKERFILE" != './Dockerfile' ]; then
    yarn build
  fi

  ${PODMAN} build \
    -f "$DOCKERFILE" \
    --force-rm \
    --tag quay.io/"$(whoami)"/assisted-installer-ui:"$REACT_APP_GIT_SHA" \
    --build-arg=REACT_APP_BUILD_MODE="$REACT_APP_BUILD_MODE" \
    --build-arg=REACT_APP_GIT_SHA="$REACT_APP_GIT_SHA" \
    --build-arg=REACT_APP_VERSION="$REACT_APP_VERSION" \
    .
}

main "$@"
