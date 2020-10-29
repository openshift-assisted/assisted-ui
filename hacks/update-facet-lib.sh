#!/bin/bash
set -e

export FACET_REPO_ROOT=${FACET_REPO_ROOT:-'https://github.com/mareklibra/facet'}
echo FACET_REPO_ROOT: ${FACET_REPO_ROOT}

export FACET_REPO=${FACET_REPO_ROOT}.git
echo FACET_REPO: ${FACET_REPO}

export FACET_UPSTREAM_REPO=${FACET_UPSTREAM_REPO:-'https://github.com/openshift-metal3/facet.git'}
echo FACET_UPSTREAM_REPO: ${FACET_UPSTREAM_REPO}

# this is more handy than yarn-upgrade
export FACET_LIB_VERSION=${FACET_LIB_VERSION:-"`npm search facet-lib --parseable|grep '^facet-lib'|cut -f 5`"}
echo FACET_LIB_VERSION: $FACET_LIB_VERSION

export BRANCH=${BRANCH:-"facet-lib.${FACET_LIB_VERSION}"}

export TMPDIR=`mktemp -d /tmp/facet-lib-XXXX`
echo TMPDIR: $TMPDIR

cd ${TMPDIR}
git clone ${FACET_REPO}
cd facet
git remote add upstream ${FACET_UPSTREAM_REPO}
git fetch --all && git reset --hard upstream/master
git checkout -b "${BRANCH}"

sed -i "s/^    \"facet-lib\": \".*\",$/    \"facet-lib\": \"^${FACET_LIB_VERSION}\",/g" package.json
yarn install
git status
git add package.json yarn.lock

touch dummy
git add dummy

git commit -m "Update facet-lib to ${FACET_LIB_VERSION}"
git push --set-upstream origin "${BRANCH}"

# open a pull-request
xdg-open "${FACET_REPO_ROOT}/pull/new/${BRANCH}" &

echo Once the new PR is merged, mind creating a new release: https://github.com/openshift-metal3/facet/releases
