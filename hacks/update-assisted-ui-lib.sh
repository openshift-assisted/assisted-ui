#!/bin/bash
set -e

export RED_COLOR='\033[0;31m'
export GREEN_COLOR='\033[0;32m'
export NC='\033[0m' # No Color

# this is more handy than yarn-upgrade
export ASSISTED_UI_LIB_VERSION=${ASSISTED_UI_LIB_VERSION:-"`npm cache clean --force ; npm view openshift-assisted-ui-lib version`"}
echo -e "${GREEN_COLOR}ASSISTED_UI_LIB_VERSION: ${RED_COLOR}$ASSISTED_UI_LIB_VERSION${NC}"

export GITHUB_USER=${GITHUB_USER:-"`whoami`"}
echo GITHUB_USER: $GITHUB_USER
export GITLAB_USER=${GITLAB_USER:-"`whoami`"}
echo GITLAB_USER: $GITLAB_USER

export ASSISTED_UI_USER_REPO=${ASSISTED_UI_USER_REPO:-"git@github.com:${GITHUB_USER}/assisted-ui.git"}
echo ASSISTED_UI_USER_REPO: $ASSISTED_UI_USER_REPO

export UHC_PORTAL_REPO=${UHC_PORTAL_REPO:-"git@gitlab.cee.redhat.com:${GITLAB_USER}/uhc-portal.git"}
echo UHC_PORTAL_REPO: ${UHC_PORTAL_REPO}

export TAG=${TAG:-"assisted-ui-lib-${ASSISTED_UI_LIB_VERSION}"}
export UPDATE_BRANCH="assisted-ui-lib.auto.v${ASSISTED_UI_LIB_VERSION}"

export TMPDIR=`mktemp -d /tmp/assisted-ui-XXXX`
echo TMPDIR: $TMPDIR

# Helper functions
function uriencode {
  jq -nr --arg v "$1" '$v|@uri';
}

# update assisted-ui
echo -e "${GREEN_COLOR}Updating assisted-ui${NC}"
cd ${TMPDIR}
git clone ${ASSISTED_UI_USER_REPO}
cd assisted-ui
git remote add upstream https://github.com/openshift-assisted/assisted-ui.git
git fetch --all && git reset --hard upstream/master
git checkout -b ${UPDATE_BRANCH}

sed -i "s/^    \"openshift-assisted-ui-lib\": \".*\",$/    \"openshift-assisted-ui-lib\": \"${ASSISTED_UI_LIB_VERSION}\",/g" package.json
yarn install
git status
git diff
git add package.json yarn.lock

git commit -m "Update openshift-assisted-ui-lib to ${ASSISTED_UI_LIB_VERSION}"
git tag -a ${TAG} -m "openshift-assisted-ui-lib updated to version ${ASSISTED_UI_LIB_VERSION}"

# update uhc-portal
echo -e "${GREEN_COLOR}Updating uhc-portal${NC}"
cd ${TMPDIR}
git clone ${UHC_PORTAL_REPO}
cd uhc-portal
git remote add upstream git@gitlab.cee.redhat.com:service/uhc-portal.git
git fetch --all && git reset --hard upstream/master
git checkout -b ${UPDATE_BRANCH}

sed -i "s/^    \"openshift-assisted-ui-lib\": \".*\",$/    \"openshift-assisted-ui-lib\": \"${ASSISTED_UI_LIB_VERSION}\",/g" package.json
yarn install
git status
git diff
git add package.json yarn.lock

git commit -m "Update openshift-assisted-ui-lib to ${ASSISTED_UI_LIB_VERSION}"
# no tag for uhc-portal, just commit

# All remote changes at the end
echo -e "${GREEN_COLOR}Pushing changes to remote${NC}"

cd ${TMPDIR}/uhc-portal
echo Pushing to ${UHC_PORTAL_REPO} to create a merge request there
git push --set-upstream origin ${UPDATE_BRANCH}

cd ${TMPDIR}/assisted-ui
echo Pushing to ${ASSISTED_UI_USER_REPO} to create a pull request there
git push --set-upstream origin ${UPDATE_BRANCH} --follow-tags

# The last mile in a browser for convenience
xdg-open "https://github.com/openshift-assisted/assisted-ui-lib/pulls" & # to close/re-open generated PR (optional)

xdg-open "https://gitlab.cee.redhat.com/${GITLAB_USER}/uhc-portal/-/merge_requests/new?merge_request%5Bsource_branch%5D=${UPDATE_BRANCH}&merge_request%5Btitle%5D=WIP: Updates openshift-assisted-ui-lib to ${ASSISTED_UI_LIB_VERSION}&merge_request%5Bdescription%5D=TODO: Remove the WIP when [phase1 testing]($(uriencode https://auto-jenkins-csb-kniqe.apps.ocp-c1.prod.psi.redhat.com/view/CI-Assisted-Installer/job/CI/job/assisted-saas-phase1-ui/)) passes overnight. Until then the review and merge is blocked here." &

export LIB_RELEASE_URL=`uriencode "${TAG}: https://github.com/openshift-assisted/assisted-ui-lib/releases/tag/v${ASSISTED_UI_LIB_VERSION}"`
export RELEASE_URL=`uriencode "https://github.com/openshift-assisted/assisted-ui/releases/new?tag=v${ASSISTED_UI_LIB_VERSION}&title=v${ASSISTED_UI_LIB_VERSION}&body=${LIB_RELEASE_URL}"`
xdg-open "https://github.com/openshift-assisted/assisted-ui/compare/master...${GITHUB_USER}:${UPDATE_BRANCH}?expand=1&pull_request%5Bbody%5D=Instructions: once this PR is merged, continue by creating a new release [here](%0A${RELEASE_URL})"

echo -e "All set. Continue by create and ${GREEN_COLOR}merge${NC} Pull Request in the assisted-ui project"

