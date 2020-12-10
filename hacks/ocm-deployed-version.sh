#!/bin/bash
set -e

# Prints openshift-assisted-ui-lib version currently deployed in OCM staging

export YARN_LOCK=${YARN_LOCK:-https://gitlab.cee.redhat.com/service/uhc-portal/-/raw/master/yarn.lock}

curl --silent ${YARN_LOCK} | awk '/^openshift-assisted-ui-lib@/{getline; print}' - | sed -e 's/^.*"\(.*\)"/\1/'

