# Fixes issue with watching changes to node_modules/openshift-assisted-ui-lib by webpack dev server
set -x
sed -i 's/ ignored: ignoredFiles/ \/\* See hacks\/patch-react-scripts.sh \*\/ \/\/ ignored: ignoredFiles/g' node_modules/react-scripts/config/webpackDevServer.config.js 

# https://github.com/webpack-contrib/source-map-loader/issues/144
sed -i 's/const options = this.getOptions(_options.default);/const options = this.getOptions ? this.getOptions(_options.default) : {};/g' node_modules/source-map-loader/dist/index.js
