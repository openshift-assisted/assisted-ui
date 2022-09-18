REACT_APP_API_URL="http://REACT_APP_API_URL.env.variable.not:set"
REACT_APP_VERSION="$(node -e 'console.log(require("./node_modules/openshift-assisted-ui-lib/package.json").version)')"
REACT_APP_GIT_SHA="$(git rev-parse --short HEAD)"

export REACT_APP_API_URL
export REACT_APP_VERSION
export REACT_APP_GIT_SHA
