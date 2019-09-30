const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Critters = require("critters-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Código Falado Rules",
      template: "./src/index.html",
      inject: true,
      minify: {
        // removeComments: true,
        // collapseWhitespace: false
      }
    }),
    new Critters({
      pruneSource: false,
      compress: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs"
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"]
          }
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader"
        }
      }
    ]
  }
};
