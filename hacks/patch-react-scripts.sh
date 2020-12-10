# Fixes issue with watching changes to node_modules/openshift-assisted-ui-lib by webpack dev server
sed -i 's/ ignored: ignoredFiles/ \/\* See hacks\/patch-react-scripts.sh \*\/ \/\/ ignored: ignoredFiles/g' node_modules/react-scripts/config/webpackDevServer.config.js 

