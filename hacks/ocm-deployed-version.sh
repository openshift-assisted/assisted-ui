#!/bin/bash
set -e

# Prints facet-lib version currently deployed in OCM staging

export YARN_LOCK=${YARN_LOCK:-https://gitlab.cee.redhat.com/service/uhc-portal/-/raw/master/yarn.lock}

curl --silent ${YARN_LOCK} | awk '/^facet-lib@/{getline; print}' - | sed -e 's/^.*"\(.*\)"/\1/'

