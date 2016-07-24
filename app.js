'use strict';
var AV = require('leanengine');
var Order = AV.Object.extend('Order');
var domain = require('domain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var WXPay = require('weixin-pay');
var todos = require('./routes/todos');
var cloud = require('./cloud');
var more = require('./routes/more');
var manage = require('./routes/manage');
var wechat = require('./routes/wechatBot');
var user = require('./routes/user');
var ask = require('./routes/ask');
var askme = require('./routes/askme');
var wallet = require('./routes/wallet');
var hode = require('./routes/hode');
var authorization = require('./routes/authorization');
var config = require('./config');
var Haved = AV.Object.extend('Haved');
var Withdraw = AV.Object.extend('Withdraw');

var wxpay = WXPay({
  appid: config.appid,
  mch_id: '1298230401',
  partner_key: 'myworldwenwo20151016myworldwenwo', //微信商户平台API密钥
  pfx: fs.readFileSync('./routes/certificate/apiclient_cert.p12'), //微信商户平台证书
});

// var wechat = require('wechat');
// var config = {
//   token: 'wenwo',
//   appid: config.appid,
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

/*app.get('/', function(req, res) {
  var username = req.query.username;

  //
  var lng = req.query.geox;
  var lat = req.query.geoy;
  var user = AV.User.current();

console.log(user);
  //username = decodeURI(username);
  if (!user) {
    authorize(req, res);
  }
  else{
    var username = user.get('user');
    console.log(username);
    if(lng && lat){
      res.render('index', { username: username, lng:lng, lat:lat});
    }
    res.render('index', { username: username, lng:"0", lat:"0"});
  }
});*/


var test = 0;

app.get('/', function(req, res) {
  var username =  req.query.username;
  var lng = req.query.geox;
  var lat = req.query.geoy;
  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    console.log(username);
    res.render('food', { username: username, lng:lng, lat:lat});
  }
  res.render('food', { username: username, lng:"0", lat:"0"});
});

app.get('/wenwo', function(req, res) {
  var username =  req.query.username;
  var lng = req.query.geox;
  var lat = req.query.geoy;
  //username = decodeURI(username);
  if(lng && lat){
    res.render('index', { username: username, lng:lng, lat:lat});
  }
  res.render('index', { username: username, lng:"0", lat:"0"});
});

app.get('/map', function(req, res) {
  var lng = req.query.lng;
  var lat = req.query.lat;
  //username = decodeURI(username);
  if(lng && lat){
    res.render('map', {lng:lng, lat:lat});
  }
  res.render('map', {lng:"0", lat:"0"});
});

// app.get('/food', function(req, res) {
//   var username =  req.query.username;
//   var lng = req.query.geox;
//   var lat = req.query.geoy;
//   //username = decodeURI(username);
//   if(!username){
//     username = '573b0e3df38c8400673bb48d';
//   }
//   if(lng && lat){
//     res.render('food', { username: username, lng:lng, lat:lat});
//   }
//   res.render('food', { username: username, lng:"0", lat:"0"});
// });

app.get('/food', function(req, res) {
  var username =  req.query.username;
  var lng = req.query.geox;
  var lat = req.query.geoy;
  var user = AV.User.current();

  var username = "573b0e3df38c8400673bb48d";
  if(username && test){
    res.render('food', { username: username, lng:lng, lat:lat});
  }

  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    console.log(username);
    res.render('food', { username: username, lng:lng, lat:lat});
  }
  res.render('food', { username: username, lng:"0", lat:"0"});
});

app.get('/edit', function(req, res) {
  var type = req.query.type;
  var askid = req.query.askid;

  var username = "573b0e3df38c8400673bb48d";
  if(username && test){
    res.render('edit', {username:username,type:type,askid:askid});
  }

  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    console.log(username);
    res.render('edit', {username:username,type:type,askid:askid});
  }
});

app.get('/detail', function(req, res) {
  var askid =  req.query.askid;
  var username = "573b0e3df38c8400673bb48d";
  if(username && test){
    res.render('detail', {askid:askid,username:username});
  }
  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    console.log(username);
    res.render('detail', {askid:askid,username:username});
  }
});

app.get('/test', function(req, res) {
  res.render("test");
});
app.get('/wxpay/test', function(req, res) {
  res.render("wxpay/jsapi");
});
app.post('/test', function(req, res) {
  res.send("hello");
});

app.use('/notify', wxpay.useWXCallback(function(msg, req, res, next){
  //问我
  // 处理商户业务逻辑
  // console.log('notify');
  // var returnCode = req.query.return_code;
  // var returnMsg = req.query.return_msg;
  // //console.log("msg" + msg);
  // //console.log("code:" + returnCode);
  // //console.log("returnMsg:" + returnMsg);
  // if (returnMsg != null) {
  //   console.log(returnMsg);
  //   return;
  // }
  //
  // var feeType = msg.fee_type;
  // var totalFee = msg.total_fee;
  // var transactionId = msg.transaction_id;
  // var tradeType = msg.trade_type;
  // var nonceStr = msg.nonce_str;
  // var sign = msg.nonce_str;
  // var bankType = msg.bank_type;
  // var outTradeNo = msg.out_trade_no;
  // var timeEnd = msg.time_end;
  // var openid = msg.openid;
  //
  // var query = new AV.Query('Order');
  // query.equalTo('transactionId', transactionId);
  // query.find().then(function (resuletes) {
  //   console.log(resuletes);
  //   if (resuletes != '') {
  //     console.log('已处理');
  //
  //     return;
  //   }
  //   else {
  //     console.log('未处理');
  //     var order = new Order();
  //     order.set('openid', openid);
  //     order.set('feeType', feeType);
  //     order.set('totalFee', totalFee);
  //     order.set('transactionId', transactionId);
  //     order.set('tradeType', tradeType);
  //     order.set('nonceStr', nonceStr);
  //     order.set('sign', sign);
  //     order.set('bankType', bankType);
  //     order.set('outTradeNo', outTradeNo);
  //     order.set('timeEnd', timeEnd);
  //     //order.set('userName', user.get('user'));
  //     order.save().then(function (order) {
  //       totalFee = parseFloat(totalFee);
  //       totalFee = totalFee / 100;
  //       console.log('totalFee:'+totalFee);
  //
  //       var query = new AV.Query('_User');
  //       query.find().then(function (user) {
  //         //console.log(user.get('authData'));
  //         for (var i = 0; i < user.length; i++) {
  //           console.log(user[i].get('authData').weixin.openid);
  //           if (user[i].get('authData').weixin.openid == openid) {
  //             var userMa = user[i];
  //             console.log(userMa.get('wallet').id);
  //             order.set('userName', userMa.get('user'));
  //             order.save().then(function () {
  //               var walletId = userMa.get('wallet').id;
  //               var query = new AV.Query('Wallet');
  //               query.get(walletId).then(function (wallet) {
  //                 //console.log(wallet);
  //                 //console.log(wallet.get('money'));
  //                 var money = parseFloat(wallet.get('money'));
  //                 money += totalFee;
  //                 console.log('money:'+money);
  //                 wallet.set('money', money);
  //                 wallet.save().then(function () {
  //                   res.success();
  //                 }, function(error) {
  //                   // 失败
  //                   console.log('Error: ' + error.code + ' ' + error.message);
  //                 });
  //
  //
  //               });
  //             });
  //
  //
  //           }
  //
  //         }
  //       });
  //     }, function(error) {
  //       // 失败
  //       console.log('Error: ' + error.code + ' ' + error.message);
  //     });
  //
  //
  //   }
  // });



  // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。


  // 问我 - 美食
  var returnCode = req.query.return_code;
  var returnMsg = req.query.return_msg;
  if (returnMsg != null) {
    console.log(returnMsg);
  } else  {
    var feeType = msg.fee_type;
    var totalFee = msg.total_fee;
    var transactionId = msg.transaction_id;
    var tradeType = msg.trade_type;
    var nonceStr = msg.nonce_str;
    var sign = msg.nonce_str;
    var bankType = msg.bank_type;
    var outTradeNo = msg.out_trade_no;
    var timeEnd = msg.time_end;
    var openid = msg.openid;
    var attach = msg.attach;
    var query = new AV.Query('Order');
    query.equalTo('transactionId', transactionId);
    query.find().then(function (resuletes) {

      if (resuletes != '') {
        console.log('已处理');
      } else {
        var order = new Order();
        order.set('openid', openid);
        order.set('feeType', feeType);
        order.set('totalFee', totalFee);
        order.set('transactionId', transactionId);
        order.set('tradeType', tradeType);
        order.set('nonceStr', nonceStr);
        order.set('sign', sign);
        order.set('bankType', bankType);
        order.set('outTradeNo', outTradeNo);
        order.set('timeEnd', timeEnd);
        order.set('attach', attach);

        attach = JSON.parse(attach);
        var userName = attach.username;
        var askId = attach.ask_id;

        var price = parseFloat(totalFee) / 100.0;

        var query = new AV.Query('UserInfo');
        query.get(userName).then(function (user) {
          var query = new AV.Query('AskMe');
          query.get(askId).then(function (ask) {

            var incomeUser = ask.get('createBy');
            var incomeTotal = (price * 90 / 100).toFixed(2);

            var have = new Haved();
            have.set('ask', ask);
            have.set('type', '2');
            have.set('by', userName);
            have.set('askDate', ask.updatedAt);
            have.set('price', ask.get('askPrice'));
            have.set('byName', user.get('uName'));
            have.set('byUrl', user.get('userHead'));
            have.set('askOwn', ask.get('createBy'));
            have.set('income', incomeTotal);

            ask.set('score', (parseInt(ask.get('score'))+1).toString());



            have.set('income', incomeTotal);

            var query = new AV.Query('UserInfo');
            query.include('wallet');
            query.get(incomeUser).then(function (incomeUser) {
              incomeUser.get('wallet').set('money', incomeUser.get('wallet').get('money') + parseFloat(incomeTotal));
              incomeUser.get('wallet').set('total', (parseFloat(incomeUser.get('total').get('money')) + parseFloat(incomeTotal)).toString());
              incomeUser.get('wallet').save().then(function () {
                incomeUser.save().then(function () {
                  have.save().then(function () {
                    order.save().then(function () {
                      ask.save().then(function () {
                        res.success();
                      });

                    });
                  });
                });
              });

            });


          });
        });


      }
    });
  }


}));

// 可以将一类的路由单独保存在一个文件中
app.use('/todos', todos);
app.use('/more', more);
app.use('/wechat', wechat);
app.use('/user', user);
app.use('/ask', ask);
app.use('/askme', askme);
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

function authorize(req, res) {
  var appid = config.appid;
  var secret = config.appsecret;

  var url = req.originalUrl;
  console.log(url);
  //url = 'http://wenwo.leanapp.cn' + url;
  //console.log(req.rawHeaders);
  //var url = req.rawHeaders[17];
  url = "http://" + req.headers.host + url;
  //url = encodeURIComponent(url);
  //var urlApi = "http://wenwo.leanapp.cn/authorization/?url="+url;
  var urlApi = "http://" + req.headers.host + "/authorization/?url=" + url;
  console.log(urlApi);
  urlApi = encodeURIComponent(urlApi);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

  res.redirect(url);
}

function settleAccounts() {

  var query = new AV.Query('_User');
  query.include('wallet');
  query.find().then(function (userList) {

    oneAccounts(userList, 0);

  });

}

function oneAccounts(userList, index) {

  var user = userList[index];

  if (inde >= userList.length) {
    return;
  } else {
    if (parseInt(userList[index].get('wallet').get('money')) > 1) {

      var reamount = parseInt(parseFloat(user.get('wallet').get('money')) * 100);

      var authData = user.get('authData');
      var openid = authData.weixin.openid;
      var accessToken = authData.weixin.access_token;
      var expiresIn = authData.weixin.expires_in;

      var mchid = '1298230401';

      var date = new Date();
      date = moment(date).format("YYYYMMDDHHmmss");
      var str = date + getNonceStr(10);
      var partnerTradeNo = str;

      var nonceStr = getNonceStr();

      var checkName = 'NO_CHECK';
      var desc = '提现';
      var ip = req.ip;
      ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);

      var data = {
        mch_appid : config.appid,
        mchid : mchid,
        nonce_str : nonceStr,
        partner_trade_no : partnerTradeNo,
        openid : openid,
        check_name : checkName,
        amount : reamount,
        desc : desc,
        spbill_create_ip : ip
      };

    } else {
      index++;
      oneAccounts(userList, index);

    }


  }

}

function getNonceStr(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var maxPos = chars.length;
  var noceStr = "";
  for (var i = 0; i < (length || 32); i++) {
    noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return noceStr;
}

//云引擎定时函数
exports.settleAccounts = function(){
  settleAccounts();
};

module.exports = app;
