const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "html", "index.html"),
      filename: "index.html",
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, "src/images"), to: "images" },
        {
          from: path.resolve(__dirname, "src/html/place/index.html"),
          to: "place.html",
        },
        // { from: path.resolve(__dirname, 'src/html/place/index.html'), to: 'place/index.html' },
        //  // for localhost
        {
          from: path.resolve(__dirname, "src/html/about/index.html"),
          to: "about.html",
        },
        // { from: path.resolve(__dirname, 'src/html/about/index.html'), to: 'about/index.html' },
        //  // for localhost
      ],
    }),
  ],
  entry: {
    filename: path.resolve(__dirname, "src/js/main.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  devServer: {
    watchFiles: path.join(__dirname, "src"),
    port: 5173,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
};
