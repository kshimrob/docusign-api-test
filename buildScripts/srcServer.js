const express = require('express');
const path = require('path');
const open = require('open');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../webpack.config.dev');

var port = 3000;
var app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, function(err){
  if (err) {
      console.log(err);
  } else {
      open('http://localhost:' + port);
  }
});

console.log('Running on port 3000');