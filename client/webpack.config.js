const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


  module.exports = {
      entry: {
        'auctioneer' : path.resolve(__dirname, './scripts/auctioneer.js'),
        'bidder' : path.resolve(__dirname, './scripts/bidder.js')
      },
  
      mode: 'production',
  
      output: {
          path: path.resolve(__dirname, '../server/public'),
          filename: 'scripts/[name]-bundle.js'
      },
  
      plugins: [
        
          new HtmlWebpackPlugin({
              template: path.resolve(__dirname, 'auctioneer.html'),
              filename: path.resolve(__dirname, '../server/public', 'auctioneer.html'),
              chunks: ['auctioneer'],
          }),
          
          new HtmlWebpackPlugin({
              template: path.resolve(__dirname, 'bidder.html'),
              filename: path.resolve(__dirname, '../server/public', 'bidder.html'),
              chunks: ['bidder'],
          }),
          
          new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'html/'), to: path.resolve(__dirname, '../server/public') },
                { from: path.resolve(__dirname, 'images'), to: path.resolve(__dirname, '../server/public/images') },
                { from: path.resolve(__dirname, 'style'), to: path.resolve(__dirname, '../server/public/style') },
                {
                  context: path.resolve(__dirname, 'scripts'),
                  from: 'messageConstants.js',
                  to: '../public/scripts/messageConstants.js'               
                },
                {
                  context: path.resolve(__dirname, 'scripts'),
                  from: 'tools.js',
                  to: '../public/scripts/tools.js'               
                },
                {
                  context: path.resolve(__dirname, 'scripts'),
                  from: 'contentTypeUtil.js',
                  to: '../public/scripts/contentTypeUtil.js'               
                }
              
            ],
          })
        
      ],


  };