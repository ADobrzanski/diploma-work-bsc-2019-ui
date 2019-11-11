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
  },
};
