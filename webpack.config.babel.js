import {join} from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const PATHS = {
  app: join(__dirname, 'src'),
  dist: join(__dirname, 'dist')
};

export default {
  entry: PATHS.app,
  output: {
    path: PATHS.dist,
    filename: 'bundle.[hash].js'
  },
  devServer: {
    port: 4444,
    hot: true,
    inline: true,
    contentBase: PATHS.dist
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }]
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Pixel Speed',
      template: join(__dirname, 'public/index.ejs')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
