/**
 * Created by HanQi on 16/5/9.
 */
var http = require('http');
//var MD5 = require('MD5');
//var crypto = require('crypto');
var fs = require('fs');
var WXPay = require('weixin-pay');
//var wechat = require('wechat');
var router = require('express').Router();
var xml2js = require('xml2js');
var AV = require('leanengine');
var request = require('request');
var Post = AV.Object.extend('UserInfo');
var Wallet = AV.Object.extend('Wallet');
var md5 = require('MD5');
var moment = require("moment");
var User = AV.Object.extend('_User');
var Withdraw = AV.Object.extend('Withdraw');
// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var resG;
var appid = 'wx99f15635dd7d9e3c';
var key = 'myworldwenwo20151016myworldwenwo';
var mchid = '1298230401';
var wxpay = WXPay({
    appid: appid,
    mch_id: mchid,
    partner_key: key, //微信商户平台API密钥
    pfx: fs.readFileSync('./routes/certificate/apiclient_cert.p12'), //微信商户平台证书
});


router.get('/wx', function(req, res, next) {
    // var url = req.originalUrl;
    // url = 'http://wenwo.leanapp.cn' + url;
    //var url = req.rawHeaders[15];
    var url = 'http://wenwo.leanapp.cn/';
    console.log(url);
    url = encodeURIComponent(url);
    console.log(url);

    //console.log(url);
    var urlApi = "http://wenwo.leanapp.cn/authorization/?url="+url;
    authorize(res, urlApi);
});

router.post('/pay_t', function(req, res, next) {
    var totalFee = req.param('totalFee');
    console.log(totalFee);
    //var totalFee = 3;
    totalFee = parseFloat(totalFee);
    // totalFee = totalFee / 100;
    // totalFee = totalFee * 100;
    console.log(totalFee);
    var secret = '9157e84975386b6dee6a499cc639973e';


    // var body = 'test';
    // var notifyUrl = 'http://wenwo.leanapp.cn/auauthorization/notify';
    // var ip = req.ip;
    // var total = 0.01;
     var ip = req.ip;
     ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);
     console.log(ip);
    // unified(appid, mchid, body, notifyUrl, ip, total, secret, {
    //     success:function (result) {
    //         console.log(result);
    //     }
    // });
    var code = req.query.code;
    if (code == null) {
        // totalFee = totalFee / 100;
        console.log(totalFee);
        var urlApi = "http://wenwo.leanapp.cn/authorization/pay_t?totalFee="+totalFee;
        //var urlApi = "/authorization/pay_t";
        authorize(res, urlApi);
        return;
    }
    getAccessToken(appid, secret, code, res, {
         success:function (result) {
            var codeData = result.data;
            codeData = JSON.parse(codeData);
            var accessToken = codeData.access_token;
            var openid = codeData.openid;
            var expiresIn = codeData.expires_in;


        //     wxpay.createUnifiedOrder({
        //         body: 'test',
        //         out_trade_no: '20151016'+Math.random().toString().substr(2, 10),
        //         total_fee: 1,
        //         spbill_create_ip: ip,
        //         notify_url: 'http://wenwo.leanapp.cn/auauthorization/notify',
        //         trade_type: 'JSAPI',
        //         openid:  openid
        //         //product_id: '1234567890'
        //     }, function(err, result){
        //         console.log(result);
        //         var nonceStr = result.nonce_str;
        //         var sign = result.sign;
        //         var prepayId = result.prepay_id;
        //
        //     });
             AV.User._logInWith('weixin', {
                 'authData': {
                     "openid": openid,
                     "access_token": accessToken,
                     "expires_in": expiresIn
                 }
             }).then(function(user) {
                 var notifyUrl = 'http://wenwo.leanapp.cn/notify';
                 //notifyUrl = encodeURIComponent(notifyUrl);
                 wxpay.getBrandWCPayRequestParams({
                     openid: openid,
                     body: '公众号支付测试',
                     detail: '公众号支付测试',
                     out_trade_no: '20150331'+Math.random().toString().substr(2, 10),
                     total_fee: totalFee,
                     spbill_create_ip: ip,
                     notify_url:notifyUrl
                 }, function(err, result){
                     // in express
                     //console.log(result);
                     res.render('wxpay/jsapi', {payargs:result, appId:result.appId, timeStamp:result.timeStamp, package:result.package, signType:result.signType, paySign:result.paySign, nonceStr:result.nonceStr})
                 });


             });



         }



    });

});

router.get('/test', function(req, res, next) {
    var date = new Date();
    date = moment(date).format("YYYYMMDDHHmmss");
    var str = date + getNonceStr(10);
    console.log(str);
});

router.get('/pay', function(req, res, next) {

});


router.get('/withdraw', function(req, res, next) {
    var code = req.query.code;
    var secret = '9157e84975386b6dee6a499cc639973e';
    var username = req.query.username;
    var amount = req.query.amount;
    if (code == null) {
        var urlApi = "http://wenwo.leanapp.cn/authorization/withdraw?amount="+amount+"&username="+username;
        //var urlApi = "/authorization/pay_t";
        authorize(res, urlApi);
        return;
    }

    var query = new AV.Query('Config');
    query.find().then(function (configs) {
        for (var i = 0; i < configs.length; i++) {
            if (configs[i].get('name') == 'commission') {
                var commission = parseInt(configs[i].get('value'));
                //var amount = 1;
                var query = new AV.Query('UserInfo');
                query.equalTo('userName', username);
                query.find().then(function(results) {
                    if (results[0] == '' || results[0] == null) {
                        var result = {
                            code : 300,
                            message : '未找到该用户'
                        };
                        res.send(result);
                        return;
                    }
                    else {
                        var allAmount = Math.ceil(parseFloat(amount)/100*commission*100)/100;
                        var id = results[0].attributes.wallet.id;
                        var query = new AV.Query('Wallet');
                        query.get(id).then(function (wallet) {
                            var money = wallet.get('money');
                            if (parseFloat(money) < parseFloat(allAmount)) {
                                var result = {
                                    code : 700,
                                    message : '余额不足'
                                };
                                res.send(result);
                                return;
                            }
                            else {
                                // amount = parseFloat(amount);
                                // amount = amount * 100;
                                var date = new Date();
                                date = moment(date).format("YYYYMMDDHHmmss");
                                var str = date + getNonceStr(10);

                                var appid = 'wx99f15635dd7d9e3c';
                                var mchid = '1298230401';
                                var nonceStr = getNonceStr();
                                //var sign = getSign();
                                var partnerTradeNo = str;
                                //var openid = '';
                                var checkName = 'NO_CHECK';

                                var desc = '提现';
                                var ip = req.ip;
                                ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);
                                var codeData = result.data;
                                codeData = JSON.parse(codeData);
                                var accessToken = codeData.access_token;
                                var openid = codeData.openid;
                                var expiresIn = codeData.expires_in;

                                var data = {
                                    mch_appid : appid,
                                    mchid : mchid,
                                    nonce_str : nonceStr,
                                    partner_trade_no : partnerTradeNo,
                                    openid : openid,
                                    check_name : checkName,
                                    amount : amount,
                                    desc : desc,
                                    spbill_create_ip : ip
                                };
                                var sign = getSign(data);
                                data.sign = sign;
                                //console.log(data);
                                //console.log(buildXML(data));
                                //return;
                                getAccessToken(appid, secret, code, res, {
                                    success:function (result) {

                                        request({
                                            url: "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
                                            method: 'POST',
                                            body: buildXML(data),
                                            agentOptions: {
                                                pfx: fs.readFileSync('./routes/certificate/apiclient_cert.p12'),
                                                passphrase: mchid
                                            }
                                        }, function(err, response, body){
                                            //console.log(err)
                                            //console.log(response);
                                            console.log(body);
                                            parseXML(body, function (err, result) {
                                                console.log(result);
                                                if (result.return_code == 'SUCCESS' && result.return_msg == '') {
                                                    var withdraw = new Withdraw();
                                                    withdraw.set('nonceStr', result.nonce_str);
                                                    withdraw.set('partnerTradeNo', result.partner_trade_no);
                                                    withdraw.set('paymentNo', result.payment_no);
                                                    withdraw.set('paymentTime', result.payment_time);
                                                    withdraw.save().then(function (post) {
                                                        wallet.set('money', parseFloat(parseFloat(money) - parseFloat(allAmount)));
                                                        wallet.save().then(function (wallet) {
                                                            var result = {
                                                                code : 200,
                                                                data : wallet,
                                                                message : 'Operation succeeded'
                                                            };
                                                            res.send(result);
                                                        });

                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });

                    }
                });
            }
        }
    });







});

router.get('/', function(req, res, next) {
    //url = decodeURIComponent(url);
    console.log(req.query.url);
    var urlReq = decodeURIComponent(req.query.url);
    console.log(urlReq);
    var appid = 'wx99f15635dd7d9e3c';
    var secret = '9157e84975386b6dee6a499cc639973e';

    var code = req.query.code;
    resG = res;
    console.log("code:" +code);
    
    getAccessToken(appid, secret, code, res,{
        success:function (result) {
            //console.log("result" + result.data);
            var codeData = result.data;
            codeData = JSON.parse(codeData);
            var accessToken = codeData.access_token;
            var openid = codeData.openid;
            var expiresIn = codeData.expires_in;
            //console.log("accessToken"+accessToken);
            //console.log("openid" + openid);
            getUserInfo(accessToken,openid, res,{
                success:function (res) {
                    //console.log(res.data);
                    var rdata = res.data;
                    rdata = JSON.parse(rdata);
                    var username = rdata.nickname;
                    var userhead = rdata.headimgurl;
                    var openid = rdata.openid;
                    userhead = userhead.substr(0, userhead.lastIndexOf('/'));
                    userhead += '/';
                    //console.log(username);
                    //console.log(userhead);
                    //console.log(openid);
                    AV.User._logInWith('weixin', {
                        'authData': {
                            "openid": openid,
                            "access_token": accessToken,
                            "expires_in": expiresIn
                        }
                    }).then(function(user) {
                        //返回绑定后的用户
                        //console.log(user);
                        //console.log(user.get('user'));

                        if (user.get('user') != null) {
                            console.log('haved');
                            // var user = AV.User.current();
                            console.log(user);
                            //var url = 'http://wenwo.leanapp.cn/?username='+user.get('user');
                            var url = urlReq + '?username='+user.get('user');
                            resG.redirect(url);


                        }
                        else {
                            console.log('no');
                            var post = new Post();
                            var wallet = new Wallet();
                            wallet.set('money', 0);
                            wallet.save().then(function (wallet) {
                                console.log(wallet);
                                //post.set('userName', post.id);
                                post.set('uName', username);
                                post.set('userHead', userhead);
                                post.set('wallet', wallet);
                                post.save().then(function (post) {
                                    post.set('userName', post.id);
                                    post.save().then(function (post) {
                                        user.set('userInfo', post);
                                        user.set('user', post.id);
                                        user.set('wallet', wallet);
                                        user.save().then(function (user) {
                                            // var user = AV.User.current();
                                            // console.log(user);
                                            //var url = 'http://wenwo.leanapp.cn/?username='+user.get('user');
                                            var url = urlReq + '?username='+user.get('user');
                                            resG.redirect(url);


                                        });
                                    });

                                });
                            });

                        }


                    }, function(error) {
                        console.log(error);
                    });

                    // var data = {
                    //     username:username,
                    //     password:openid,
                    //     userhead:userhead
                    // }
                    // request.post('../user/regist', {form:data}, function (error, response, body) {
                    //     console.log(response);
                    // });

                }
            });
        }
    });
    // var user = AV.User.current();
    // console.log("user:" + user);
    // var url = 'http://wenwo.leanapp.cn/';
    // res.redirect(url);

});

function unified(appid, mchid, body, notifyUrl, ip, total, secret, callback) {
    var nonce = Math.ceil(Math.random()*100000000000000).toString();
    var sign = getSign(appid, mchid, nonce, body, notifyUrl, ip, total, secret);
    AV.Cloud.httpRequest({
        method: 'POST',
        url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        body: {
            appid: appid,
            mch_id: mchid,
            nonce_str: nonce,
            body: body,
            trade_type : 'JSAPI',
            notify_url : notifyUrl,
            spbill_create_ip : ip,
            total_fee: total,
            sign: sign
        },
        success: function(httpResponse) {
            callback.success(httpResponse);
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
}

// function getSign(appid, mchid, nonce, body, notifyUrl, ip, total, secret) {
//     var stringA = 'appid='+appid+'&body='+body+'&mch_id='+mchid+'&nonce_str='+nonce+'&notify_url='+notifyUrl+'&spbill_create_ip='+ip+'&total_fee='+total+'&trade_type=JSAPI';
//     var stringSignTemp = stringA+'&key='+secret;
//     var sign = MD5(stringSignTemp).toUpperCase();
//     console.log("sign:"+sign);
//     return sign;
// }

function authorize(res,urlApi) {
    var appid = 'wx99f15635dd7d9e3c';
    var secret = '9157e84975386b6dee6a499cc639973e';

    //var urlApi = "http://wenwo.leanapp.cn/authorization/";
    urlApi = encodeURIComponent(urlApi);
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

    res.redirect(url);
}

function getAccessToken(appid, secret, code, res, callback) {
    AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+secret+'&code='+code+'&grant_type=authorization_code ',
        success: function(httpResponse) {
            // console.log(httpResponse);
            callback.success(httpResponse);
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
}

function getUserInfo(access_token, openid, res,callback) {
    AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
        success: function(httpResponse) {
            // console.log(httpResponse);
            callback.success(httpResponse);
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
}

// function MD5(text) {
//     return crypto.createHash('md5').update(text).digest('hex');
// };

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

function getSign(param){

    var querystring = Object.keys(param).filter(function(key){
            return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
        }).sort().map(function(key){
            return key + '=' + param[key];
        }).join("&") + "&key=" + key;

    return md5(querystring).toUpperCase();
}

module.exports = router;
