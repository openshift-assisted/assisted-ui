#!/bin/bash

set -ex

export TMPDIR=`mktemp -d /tmp/XXXX`
cd ${TMPDIR}

git clone https://github.com/openshift-metal3/facet.git
cd facet
pwd

yarn version --patch
export VERSION=`git log -1 --pretty=%B`

export BRANCH=rel-${VERSION}
git checkout -b ${BRANCH}
git push --set-upstream origin ${BRANCH} 
xdg-open https://github.com/openshift-metal3/facet/compare/${BRANCH}?expand=1 # to open pull-request with version change

yarn publish --non-interactive --access public
git push --tags
xdg-open https://www.npmjs.com/package/metal3-facet # just because ...

