#!/bin/bash
set -e

export FACET_UPSTREAM_REPO=${FACET_UPSTREAM_REPO:-'https://github.com/openshift-metal3/facet.git'}
echo FACET_UPSTREAM_REPO: ${FACET_UPSTREAM_REPO}

# this is more handy than yarn-upgrade
export FACET_LIB_VERSION=${FACET_LIB_VERSION:-"`npm cache clean --force ; npm search facet-lib --parseable|grep '^facet-lib'|cut -f 5`"}
echo FACET_LIB_VERSION: $FACET_LIB_VERSION

export TAG=${TAG:-"facet-lib-${FACET_LIB_VERSION}"}

export TMPDIR=`mktemp -d /tmp/facet-lib-XXXX`
echo TMPDIR: $TMPDIR

cd ${TMPDIR}
git clone ${FACET_UPSTREAM_REPO}
cd facet

sed -i "s/^    \"facet-lib\": \".*\",$/    \"facet-lib\": \"^${FACET_LIB_VERSION}\",/g" package.json
yarn install
git status
git diff
git add package.json yarn.lock

git commit -m "Update facet-lib to ${FACET_LIB_VERSION}"
git tag -a ${TAG} -m "facet-lib updated to version ${FACET_LIB_VERSION}"

echo A commit right to ${FACET_UPSTREAM_REPO} master will be pushed
git push --follow-tags

xdg-open "https://github.com/openshift-metal3/facet/releases/new?tag=v${FACET_LIB_VERSION}&title=v${FACET_LIB_VERSION}&body=${TAG}: https://github.com/mareklibra/facet-lib/releases/tag/v${FACET_LIB_VERSION}" &

