module.exports = {
  webpack: (config, env) => {
    if (env === 'development') {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules\/(?!(openshift-assisted-ui-lib)\/).*/,
        use: ['source-map-loader'],
        enforce: 'pre',
      });
    }

    return config;
  },
};
