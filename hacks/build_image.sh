#!/usr/bin/env bash
set -e

usage() {
  echo "Usage: $0 [ single-cluster ]" 1>&2
}

parse_args() {
  while getopts ":h" opt; do
    case $opt in
      h)
        usage
        exit 0
        ;;
      \?)
        echo "Invalid option: -$OPTARG" >&2
        usage
        exit 1
        ;;
      :)
        echo "Option -$OPTARG requires an argument." >&2
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
  ${PODMAN} build \
    --force-rm \
    --tag assisted-installer-ui:"${1:-local}" \
    --build-arg=REACT_APP_BUILD_MODE="$1" \
    --build-arg=REACT_APP_GIT_SHA="$(git rev-parse HEAD)" \
    --build-arg=REACT_APP_VERSION=latest \
    .
}

main "$@"
