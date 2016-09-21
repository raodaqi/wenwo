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
var share = require('./routes/share');
var cloud = require('./cloud');
var more = require('./routes/more');
var manage = require('./routes/manage');
var wechat = require('./routes/wechatBot');
var user = require('./routes/user');
var carousel = require('./routes/carousel');
var card = require('./routes/card');
var location = require('./routes/location');
var ask = require('./routes/ask');
var vipcard = require('./routes/vipcard');
var askme = require('./routes/askme');
var wallet = require('./routes/wallet');
var hode = require('./routes/hode');
var authorization = require('./routes/authorization');
var config = require('./config');
var Haved = AV.Object.extend('Haved');
var Withdraw = AV.Object.extend('Withdraw');
var moment = require("moment");
var md5 = require('MD5');
var request = require('request');
var xml2js = require('xml2js');
var schedule = require("node-schedule");
var bodyParser = require('body-parser');
var ueditor = require("ueditor");


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

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

// 加载云代码方法
app.use(cloud);

//compression 中间件压缩和处理静态内容
var compression = require('compression');
 
app.use(compression()); //use compression 


// 使用 LeanEngine 中间件
// （如果没有加载云代码方法请使用此方法，否则会导致部署失败，详细请阅读 LeanEngine 文档。）
// app.use(AV.Cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {

  // ueditor 客户发起上传图片请求

  if(req.query.action === 'uploadimage'){

    // 这里你可以获得上传图片的信息
    var foo = req.ueditor;
    console.log(foo.filename); // exp.png
    console.log(foo.encoding); // 7bit
    console.log(foo.mimetype); // image/png

    // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
    var img_url = '/images/ueditor/';
    res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }
  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage'){
    var dir_url = '/images/ueditor/'; // 要展示给客户端的文件夹路径
    res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
  }
  // 客户端发起其它请求
  else {

    res.setHeader('Content-Type', 'application/json');
    // 这里填写 ueditor.config.json 这个文件的路径
    res.redirect('/ueditor/nodejs/config.json')
}}));

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


var test = config.test;

app.get('/', function(req, res) {
  var username =  req.query.username;
  var lng = req.query.geox;
  var lat = req.query.geoy;
  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // var authData = user.get('authData');
    // console.log(authData);
    // authData = JSON.parse(authData);
    res.render('newfood', {username: username, lng:lng, lat:lat});
    return ;
  }
  res.render('newfood', { username: username, lng:"0", lat:"0"});
});

app.get('/share/edit', function(req, res) {
  res.render('shareEdit');
});

app.get('/down', function(req, res) {
  res.render('down');
});

app.get('/share/id/:id', function(req, res) {
  var id = req.params.id;
  var type = req.query.type;

  var query = new AV.Query('Share');
  query.get(id).then(function (data) {
    // 成功获得实例
    // data 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
    if(data.attributes.detail){
      var detail = data.attributes.detail;
      var desc = data.attributes.desc;
      var title = data.attributes.title;
      var pageTitle = data.attributes.pageTitle;
      res.render('share',{detail:detail,desc:desc,title:title,pageTitle:pageTitle,type:type});
      // res.send(detail)
    }else{
      res.render('share',{detail:"",desc:"",title:"",pageTitle:"",type:type});
    }
  }, function (error) {
    // 失败了
    console.log(error);
    res.render('share',{detail:"",desc:"",title:"",pageTitle:"",type:type});
  });
});

app.get('/wenwo', function(req, res) {
  var username =  req.query.username;
  var lng = req.query.geox;
  var lat = req.query.geoy;
  //username = decodeURI(username);
  if(lng && lat){
    res.render('index', { username: username, lng:lng, lat:lat});
    return ;
  }
  res.render('index', { username: username, lng:"0", lat:"0"});
});

app.get('/map', function(req, res) {
  var lng = req.query.lng;
  var lat = req.query.lat;
  //username = decodeURI(username);
  if(lng && lat){
    res.render('map', {lng:lng, lat:lat});
    return ;
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

  if(!username){
    var username = "573b0e3df38c8400673bb48d";
  }
  if(username && test){
    res.render('newfood', { username: username, lng:lng, lat:lat});
    return ;
  }

  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // console.log(username);
    // console.log(user);
    // var authData = user.get('authData');
    // authData = JSON.parse(authData);
    res.render('newfood', {user:user, username: username, lng:lng, lat:lat});
    return ;
  }
  res.render('newfood', { username: username, lng:"0", lat:"0"});
});

app.get('/newfood', function(req, res) {
  var username =  req.query.username;
  var lng = req.query.geox;
  var lat = req.query.geoy;
  var user = AV.User.current();

  if(!username){
    var username = "573b0e3df38c8400673bb48d";
  }
  if(username && test){
    res.render('newfood', { username: username, lng:lng, lat:lat});
    return ;
  }

  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // console.log(username);
    // console.log(user);
    // var authData = user.get('authData');
    // authData = JSON.parse(authData);
    res.render('newfood', {user:user, username: username, lng:lng, lat:lat});
    return ;
  }
  res.render('newfood', { username: username, lng:"0", lat:"0"});
});

app.get('/testedit', function(req, res) {
  var type = req.query.type;
  var askid = req.query.askid;
  var username =  req.query.username;

  if(username){
    res.render('edit', {username:username,type:type,askid:askid});
    return ;
  }

  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // console.log(username);
    res.render('edit', {username:username,type:type,askid:askid});
  }
});


app.get('/edit', function(req, res) {
  var type = req.query.type;
  var askid = req.query.askid;
  var username =  req.query.username;

  if(!username){
    var username = "573b0e3df38c8400673bb48d";
  }
  if(username && test){
    res.render('edit', {username:username,type:type,askid:askid});
    return ;
  }

  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // console.log(username);
    res.render('edit', {username:username,type:type,askid:askid});
  }
});

app.get('/edit_test', function(req, res) {
  var type = req.query.type;
  var askid = req.query.askid;
  var username =  req.query.username;

  if(!username){
    var username = "573b0e3df38c8400673bb48d";
  }
  if(username && test){
    res.render('editTest', {username:username,type:type,askid:askid});
    return ;
  }

  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // console.log(username);
    res.render('editTest', {username:username,type:type,askid:askid});
  }
});

app.get('/detail', function(req, res) {
  var askid =  req.query.askid;
  var username = "573b0e3df38c8400673bb48d";
  // console.log(askid);
  if(username && test){
    res.render('detail', {askid:askid,username:username});
    return;
  }
  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // console.log(username);
    res.render('detail', {askid:askid,username:username});
  }
});

app.get('/test', function(req, res) {
  res.render("test");
});
app.get('/wxpay/test', function(req, res) {
  res.render("wxpay/jsapi");
});
app.get('/test_by_hq', function(req, res) {

  settleAccounts();
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
    // console.log(returnMsg);
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
        // console.log('已处理');
      } else {

        // console.log('未处理');

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

        // console.log(userName);
        // console.log(askId);

        var price = parseFloat(totalFee) / 100.0;

        var query = new AV.Query('UserInfo');
        query.get(userName).then(function (user) {
          var query = new AV.Query('AskMe');
          query.get(askId).then(function (ask) {

            // console.log(ask.get('createBy'));

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

            ask.set('score', ask.get('score')+1);
            ask.set('buyNum', (parseInt(ask.get('buyNum'))+1).toString());


            have.set('income', incomeTotal);

            var query = new AV.Query('UserInfo');
            query.include('wallet');
            query.get(incomeUser).then(function (incomeUser) {
              incomeUser.get('wallet').set('money', incomeUser.get('wallet').get('money') + parseFloat(incomeTotal));
              incomeUser.get('wallet').set('total', ((parseFloat(incomeUser.get('wallet').get('total')) + parseFloat(incomeTotal))).toString());
              // console.log(incomeUser);
              incomeUser.get('wallet').save().then(function () {
                incomeUser.save().then(function () {
                  var isHavedAccount = 0;
                  for(var i = 0 ; i < config.havedAccount.length; i++){
                    if(config.havedAccount[i] == userName){
                      isHavedAccount = 1;
                      break;
                    }
                  }
                  if(isHavedAccount){
                      order.save().then(function () {
                        ask.save().then(function () {
                          res.success();
                        });

                      });
                  }else{
                    have.save().then(function () {
                      order.save().then(function () {
                        ask.save().then(function () {
                          res.success();
                        });
                      });
                    });
                  }
                  
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
app.use('/share', share);
app.use('/more', more);
app.use('/wechat', wechat);
app.use('/user', user);
app.use('/ask', ask);
app.use('/carousel', carousel);
app.use('/card', card);
app.use('/askme', askme);
app.use('/vipcard', vipcard);
app.use('/wallet', wallet);
app.use('/hode', hode);
app.use('/location', location);
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
  // console.log(url);
  //url = 'http://wenwo.leanapp.cn' + url;
  //console.log(req.rawHeaders);
  //var url = req.rawHeaders[17];
  url = "http://" + req.headers.host + url;
  //url = encodeURIComponent(url);
  //var urlApi = "http://wenwo.leanapp.cn/authorization/?url="+url;
  var urlApi = "http://" + req.headers.host + "/authorization/?url=" + url;
  // console.log(urlApi);
  urlApi = encodeURIComponent(urlApi);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

  res.redirect(url);
}

function settleAccounts() {

  var query = new AV.Query('UserInfo');
  query.include('wallet');
  query.limit(999);
  query.find().then(function (userList) {
    // console.log(userList[0]);
    oneAccounts(userList, 0);

  });

}

function oneAccounts(userList, index) {
  console.log("index:"+index);

  if (index >= userList.length) {
    return;
  } else {
    // console.log(userList[index].get('wallet'));
    if (parseInt(userList[index].get('wallet').get('money')) >= 1) {

       console.log(userList[index].id);
      var userId = userList[index].id;

      var query = new AV.Query('_User');
      query.equalTo('user', userId);
      query.include('wallet');
      query.find().then(function (users) {
        if (users == null || users == '') {
          console.log('No User');
          index++;
          oneAccounts(userList, index);

        } else  {
          // console.log(users);
          if (users[0].get('wallet') != null && users[0].get('wallet') != '') {

            var wallet = userList[index].get('wallet');

            var user = users[0];

            var reamount = parseInt(parseFloat(wallet.get('money')) * 100);

            var authData = user.get('authData');
            var openid = authData.weixin.openid;
            var accessToken = authData.weixin.access_token;
            var expiresIn = authData.weixin.expires_in;

            console.log(openid);

            var mchid = '1298230401';

            var date = new Date();
            date = moment(date).format("YYYYMMDDHHmmss");
            var str = date + getNonceStr(10);
            var partnerTradeNo = str;

            var nonceStr = getNonceStr();

            var checkName = 'NO_CHECK';
            var desc = '躺着赚钱';

            var ip = '192.168.1.1';
            // var ip = req.ip;
            // ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);

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

            data.sign = getSign(data);

            request({
              url: "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
              method: 'POST',
              body: buildXML(data),
              agentOptions: {
                pfx: fs.readFileSync('./routes/certificate/apiclient_cert.p12'),
                passphrase: mchid
              }
            }, function(err, response, body) {
              // console.log(err);
              // console.log(response);
              // console.log(body);


              parseXML(body, function (err, result) {


                if (result.return_code == 'SUCCESS' && result.return_msg == '') {
                  console.log(result);
                  var withdraw = new Withdraw();
                  withdraw.set('nonceStr', result.nonce_str);
                  withdraw.set('partnerTradeNo', result.partner_trade_no);
                  withdraw.set('paymentNo', result.payment_no);
                  withdraw.set('paymentTime', result.payment_time);
                  withdraw.set('userName', user.id);
                  withdraw.set('amount', reamount.toString());
                  withdraw.save().then(function (withdraw) {
                    console.log(withdraw);
                    wallet.set('money', 0);
                    wallet.save().then(function (wallet) {
                      console.log(wallet);
                      console.log('发放成功');
                      index++;
                      oneAccounts(userList, index);

                    }, function (error) {
                      console.log(error);
                    });


                  }, function (error) {
                    console.log(error);
                  });
                }
                else {
                  console.log('发放失败');
                  console.log(result);
                  // var re = {
                  //   code : 400,
                  //   message : result.return_msg
                  // };
                  // res.send(re);
                }
              });
            });

          } else {
            console('用户资料缺失');

            index++;
            oneAccounts(userList, index);


          }


        }

      });






    } else {
      index++;
      oneAccounts(userList, index);

    }


  }

}

function getSign(param){

  var querystring = Object.keys(param).filter(function(key){
        return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
      }).sort().map(function(key){
        return key + '=' + param[key];
      }).join("&") + "&key=" + config.key;

  return md5(querystring).toUpperCase();
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

function buildXML(json){
  var builder = new xml2js.Builder();
  return builder.buildObject(json);
}

function parseXML(xml, fn){
  var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
  parser.parseString(xml, fn||function(err, result){});
}

//云引擎定时函数
exports.settleAccounts = function(){
  settleAccounts();
};

//定时打款
// 初始化并设置定时任务的时间 每天早上9点打款
var rule = new schedule.RecurrenceRule();
rule.hour = 9;rule.minute = 0;rule.second = 0;

//处理要做的事情
 var j = schedule.scheduleJob(rule, function(){
    settleAccounts();
 });

module.exports = app;
