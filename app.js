'use strict';
var AV = require('leanengine');
var domain = require('domain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var todos = require('./routes/todos');
var cloud = require('./cloud');
var more = require('./routes/more');
var manage = require('./routes/manage');
var wechat = require('./routes/wechatBot');
var user = require('./routes/user');
var ask = require('./routes/ask');
var wallet = require('./routes/wallet');
var hode = require('./routes/hode');
var authorization = require('./routes/authorization');

// var wechat = require('wechat');
// var config = {
//   token: 'wenwo',
//   appid: 'wx99f15635dd7d9e3c',
//   encodingAESKey: 'PwwbrWMutl378fjwD5P1IkGZom5zEmXw0Coo7lVDuP6'
// };

var app = express();
app.use(AV.Cloud.CookieSession({ secret: 'my secret', maxAge: 3600000, fetchUser: true }));
// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);

// 使用 LeanEngine 中间件
// （如果没有加载云代码方法请使用此方法，否则会导致部署失败，详细请阅读 LeanEngine 文档。）
// app.use(AV.Cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 未处理异常捕获 middleware
app.use(function(req, res, next) {
  var d = null;
  if (process.domain) {
    d = process.domain;
  } else {
    d = domain.create();
  }
  d.add(req);
  d.add(res);
  d.on('error', function(err) {
    console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
    if(!res.finished) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      res.end('uncaughtException');
    }
  });
  d.run(next);
});

app.get('/', function(req, res) {
  var username = req.query.username;
  //username = decodeURI(username);
  if (username == null) {
    authorize(res);
  }
  else  {
    console.log(username);
    res.render('index', { username: username });
  }

});

app.get('/wenwo', function(req, res) {
  var username =  req.query.username;
  //username = decodeURI(username);
  res.render('index', { username: username });
});

app.get('/test', function(req, res) {
  res.render("test");
});
app.post('/test', function(req, res) {
  res.send("hello");
});

// 可以将一类的路由单独保存在一个文件中
app.use('/todos', todos);
app.use('/more', more);
app.use('/wechat', wechat);
app.use('/user', user);
app.use('/ask', ask);
app.use('/wallet', wallet);
app.use('/hode', hode);
app.use('/manage', manage);
app.use('/authorization',authorization);

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) { // jshint ignore:line
    var statusCode = err.status || 500;
    if(statusCode === 500) {
      console.error(err.stack || err);
    }
    res.status(statusCode);
    res.render('error', {
      message: err.message || err,
      error: err
    });
  });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function(err, req, res, next) { // jshint ignore:line
  res.status(err.status || 500);
  res.render('error', {
    message: err.message || err,
    error: {}
  });
});

function authorize(res) {
  var appid = 'wx99f15635dd7d9e3c';
  var secret = '9157e84975386b6dee6a499cc639973e';

  var urlApi = "http://wenwo.leanapp.cn/authorization/";
  urlApi = encodeURIComponent(urlApi);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

  res.redirect(url);
}

module.exports = app;
