//webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
   entry: './src/index.tsx',
   output: {
      path: path.join(__dirname, '/dist'),
      filename: 'bundle.js'
   },
   devServer: {
      port: 8080
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
         },
         {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'ts-loader',
         },
         {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }
      ]
   },
   resolve: {
        extensions: ['.tsx', '.ts', '.js'],
   },
   plugins:[
       new HtmlWebpackPlugin({
            template: path.join(__dirname,'/src/index.html')
       }) 
   ]
}