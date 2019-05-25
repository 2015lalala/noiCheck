const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// The path to the cesium source code
// const cesiumSource = 'node_modules/cesium/Source';
// const cesiumWorkers = '../Build/Cesium/Workers';
module.exports = {
    // configureWebpack: {
    //     plugins: [
    //         new CopyWebpackPlugin([{from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]),
    //         new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
    //         new CopyWebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
    //         new webpack.DefinePlugin({
    //             // Define relative base path in cesium for loading assets
    //             CESIUM_BASE_URL: JSON.stringify('')
    //         })
    //     ],
    //     resolve: {
    //         alias: {
    //             // Cesium module name
    //             cesium: path.resolve(__dirname, cesiumSource)
    //         }
    //     }
    // }
    devServer: {
        //直接代理服务，地址需要正确填写
        proxy: {
            '/api': {
              target: 'http://t.weather.sojson.com',
              ws: true,
              changeOrigin: true,
              pathRewrite: {
                '^/api': '/api/weather/city/'    //代理的路径
              }
            },
            '/foo': {
              target: '<other_url>'
            }
          }
    }
}