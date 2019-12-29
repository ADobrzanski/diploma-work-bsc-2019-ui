/* eslint-disable global-require */
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.musicxml$/i,
          use: 'raw-loader',
        },
      ],
    },
    plugins: [new VuetifyLoaderPlugin()],
  },
};
