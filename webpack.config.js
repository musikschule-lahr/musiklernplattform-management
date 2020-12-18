const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const paths = {
  src: path.resolve(__dirname, 'src'),
};

module.exports = (env) => {
  const dotenvconfig = { path: './.env' };
  if (process.env.IS_RELEASE) {
    dotenvconfig.path = './.env.prod';
  } else if (env) {
    if (env.IS_RELEASE) {
      dotenvconfig.path = './.env.prod';
    }
  }
  return {
    mode: 'development',
    entry: ['babel-polyfill', './src/index.js'],
    output: {
      path: path.resolve(__dirname, 'www'),
      filename: 'index.bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|svg|woff2?|ttf|eot)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },

      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: { '~': paths.src },
      modules: [paths.src, 'node_modules'],
    },
    devtool: 'inline-source-map',
    devServer: {
      port: 9093,
    },
    plugins: [
      new Dotenv(dotenvconfig),
      new CopyWebpackPlugin(
        {
          patterns: [
            {
              from: path.resolve(__dirname, './keycloak.json'),
              to: path.resolve(__dirname, 'www'),
            },
          ],
        },
      ),
    ],
  };
};
