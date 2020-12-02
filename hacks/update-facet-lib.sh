#!/bin/bash
set -e

export RED_COLOR='\033[0;31m'
export GREEN_COLOR='\033[0;32m'
export NC='\033[0m' # No Color

# this is more handy than yarn-upgrade
export FACET_LIB_VERSION=${FACET_LIB_VERSION:-"`npm cache clean --force ; npm search facet-lib --parseable|grep '^facet-lib'|cut -f 5`"}
echo -e "${GREEN_COLOR}FACET_LIB_VERSION: ${RED_COLOR}$FACET_LIB_VERSION${NC}"

export FACET_UPSTREAM_REPO=${FACET_UPSTREAM_REPO:-'https://github.com/openshift-metal3/facet.git'}
echo FACET_UPSTREAM_REPO: ${FACET_UPSTREAM_REPO}

export GITLAB_USER=${GITLAB_USER:-"`whoami`"}
export UHC_PORTAL_REPO=${UHC_PORTAL_REPO:-"https://gitlab.cee.redhat.com/${GITLAB_USER}/uhc-portal.git"}
echo UHC_PORTAL_REPO: ${UHC_PORTAL_REPO}

export TAG=${TAG:-"facet-lib-${FACET_LIB_VERSION}"}
export UHC_PORTAL_BRANCH="facet-lib.auto.v${FACET_LIB_VERSION}"

export TMPDIR=`mktemp -d /tmp/facet-lib-XXXX`
echo TMPDIR: $TMPDIR

# update facet
echo -e "${GREEN_COLOR}Updating facet${NC}"
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

# update uhc-portal
echo -e "${GREEN_COLOR}Updating uhc-portal${NC}"
cd ${TMPDIR}
git clone ${UHC_PORTAL_REPO}
cd uhc-portal
git remote add upstream git@gitlab.cee.redhat.com:service/uhc-portal.git
git fetch --all && git reset --hard upstream/master
git checkout -b ${UHC_PORTAL_BRANCH}

sed -i "s/^    \"facet-lib\": \".*\",$/    \"facet-lib\": \"^${FACET_LIB_VERSION}\",/g" package.json
yarn install
git status
git diff
git add package.json yarn.lock

git commit -m "Update facet-lib to ${FACET_LIB_VERSION}"
# no tag for uhc-portal, just commit

# All remote changes at the end
echo -e "${GREEN_COLOR}Pushing changes to remote${NC}"

cd ${TMPDIR}/facet
echo "A commit right to ${FACET_UPSTREAM_REPO} master will be pushed (wihout PR)"
git push --follow-tags

cd ${TMPDIR}/uhc-portal
echo Pushing to ${UHC_PORTAL_REPO} to create a merge request there
git push --set-upstream origin ${UHC_PORTAL_BRANCH}

# The last mile in a browser for convenience
xdg-open https://gitlab.cee.redhat.com/mlibra/uhc-portal/-/merge_requests/new?merge_request%5Bsource_branch%5D=${UHC_PORTAL_BRANCH} &
xdg-open "https://github.com/openshift-metal3/facet/releases/new?tag=v${FACET_LIB_VERSION}&title=v${FACET_LIB_VERSION}&body=${TAG}: https://github.com/mareklibra/facet-lib/releases/tag/v${FACET_LIB_VERSION}" &
xdg-open "https://github.com/mareklibra/facet-lib/pulls" & # to close/re-open generated PR (optional)

