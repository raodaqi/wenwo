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
var Apply = AV.Object.extend('Apply');
var Withdraw = AV.Object.extend('Withdraw');
var config=require('../config');
var Haved = AV.Object.extend('Haved');
// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var resG;
var appid = config.appid;
var key = 'myworldwenwo20151016myworldwenwo';
var mchid = '1298230401';
var wxpay = WXPay({
    appid: config.appid,
    mch_id: mchid,
    partner_key: key, //微信商户平台API密钥
    pfx: fs.readFileSync('./routes/certificate/apiclient_cert.p12'), //微信商户平台证书
});


router.get('/wx', function(req, res, next) {
    // var url = req.originalUrl;
    // url = 'http://www.wenwobei.com' + url;
    //var url = req.rawHeaders[15];
    var url = 'http://www.wenwobei.com/';
    // console.log(url);
    url = encodeURIComponent(url);
    // console.log(url);

    //console.log(url);
    var urlApi = "http://www.wenwobei.com/authorization/?url="+url;
    authorize(res, urlApi);
});

router.post('/isfocus', function(req, res, next) {

    var userName = req.body.username;

    var query = new AV.Query('_User');
    query.equalTo('user', userName);
    query.find().then(function (users) {
        // console.log(users[0]);

        var user = users[0];

        console.log(user.get('authData').weixin.openid);

        var openId = user.get('authData').weixin.openid;
        // var token = user.get('authData').weixin.access_token;


        AV.Cloud.httpRequest({
            url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appid+'&secret='+config.appsecret,
            success: function(httpResponse) {
                // console.log(httpResponse);
                console.log(httpResponse.data.access_token);
                var token = httpResponse.data.access_token;


                AV.Cloud.httpRequest({
                    url: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openId+'&lang=zh_CN ',
                    success: function(httpResponse) {
                        console.log(httpResponse.data.subscribe);

                        res.send({code:200,isfocus:httpResponse.data.subscribe,message:'操作成功'});

                    },
                    error: function(httpResponse) {
                        console.error('Request failed with response code ' + httpResponse.status);
                    }
                });

            },
            error: function(httpResponse) {
                console.error('Request failed with response code ' + httpResponse.status);
            }
        });





    });

});

router.get('/pay_t', function(req, res, next) {
    var totalFee = req.param('totalFee');
    // console.log(totalFee);
    //var totalFee = 3;
    totalFee = parseFloat(totalFee);
    // totalFee = totalFee / 100;
    // totalFee = totalFee * 100;
    // console.log(totalFee);
    var secret = config.appsecret;


    // var body = 'test';
    // var notifyUrl = 'http://www.wenwobei.com/auauthorization/notify';
    // var ip = req.ip;
    // var total = 0.01;
     var ip = req.ip;
     ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);
     // console.log(ip);
    // unified(appid, mchid, body, notifyUrl, ip, total, secret, {
    //     success:function (result) {
    //         console.log(result);
    //     }
    // });
    var code = req.query.code;
    if (code == null) {
        // totalFee = totalFee / 100;
        // console.log(totalFee);
        var urlApi = "http://www.wenwobei.com/authorization/pay_t?totalFee="+totalFee;
        //var urlApi = "/authorization/pay_t";
        authorizeNotInfo(res, urlApi);
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
        //         notify_url: 'http://www.wenwobei.com/auauthorization/notify',
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
                 var notifyUrl = 'http://www.wenwobei.com/notify';
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

    AV.Cloud.httpRequest({
        method: 'POST',
        url: 'https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token=',
        body: {
            title: 'Vote for Pedro',
            body: 'If you vote for Pedro, your wildest dreams will come true'
        },
        success: function(httpResponse) {
            console.log(httpResponse.text);
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });

});

router.get('/pay', function(req, res, next) {

    //问我
    // var totalFee = req.query.totalFee;
    // var user = AV.User.current();
    // if (user == null || user == '') {
    //     var result = {
    //         code : 300,
    //         message : '用户未登录'
    //     }
    //     res.send(result);
    //     return
    // }
    // else {
    //     var authData = user.get('authData');
    //     console.log(authData);
    //     var openid = authData.weixin.openid;
    //     var accessToken = authData.weixin.access_token;
    //     var expiresIn = authData.weixin.expires_in;
    //
    //     var ip = req.ip;
    //     ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);
    //     console.log(ip);
    //     var notifyUrl = 'http://www.wenwobei.com/notify';
    //     //notifyUrl = encodeURIComponent(notifyUrl);
    //
    //     wxpay.getBrandWCPayRequestParams({
    //         openid: openid,
    //         body: '公众号支付测试',
    //         detail: '公众号支付测试',
    //         out_trade_no: '20150331'+Math.random().toString().substr(2, 10),
    //         total_fee: totalFee,
    //         attach:,
    //         spbill_create_ip: ip,
    //         notify_url:notifyUrl
    //     }, function(err, result){
    //         // in express
    //         //console.log(result);
    //         res.send({code:200,payargs:result});
    //     });
    //
    // }


    //问我 - 美食

    //var totalFee = req.query.totalFee;

    var askId = req.query.ask_id;
    var userName = req.query.username;

    var query = new AV.Query('Haved');

    query.equalTo("by", userName);
    query.equalTo('type', '2');
    query.include('ask');
    query.find().then(function (havedList) {

        var havedListFlag = 0;

        for (var i = 0; i < havedList.length; i++) {

            if (havedList[i].get('ask').id == askId) {

                havedListFlag++;

            }


        }

        if (havedListFlag == 0) {

            var query = new AV.Query('AskMe');
            query.get(askId).then( function (ask) {

                var score = parseInt(ask.get('score'));


                if (score < 10 || ask.get('askPrice') == 0) {

                    var query = new AV.Query('UserInfo');
                    query.get(userName).then(function (user) {

                        var have = new Haved();
                        have.set('ask', ask);
                        have.set('type', '2');
                        have.set('by', userName);
                        have.set('askDate', ask.updatedAt);
                        have.set('price', ask.get('askPrice'));
                        have.set('byName', user.get('uName'));
                        have.set('byUrl', user.get('userHead'));
                        have.set('askOwn', ask.get('createBy'));
                        // have.set('income', incomeTotal);
                        ask.set('score', (parseInt(ask.get('score'))+1).toString());
                        ask.set('buyNum', (parseInt(ask.get('buyNum'))+1).toString());

                        have.save().then(function () {
                            ask.save().then(function (ask) {
                                res.send({code:100,data:ask ,message:'操作成功'});
                            });
                        });

                    });


                } else  {

                    var totalFee = parseFloat(ask.get('askPrice'))*100;
                    // console.log(totalFee);
                    if (parseInt(totalFee)) {

                        var user = AV.User.current();
                        if (user == null || user == '') {
                            res.send({code:300,message:'用户未登录'});
                        } else {

                            var attach = {
                                username:userName,
                                ask_id:askId
                            };
                            attach = JSON.stringify(attach);

                            //JSON.stringify();
                            var authData = user.get('authData');
                            // console.log(authData);
                            var openid = authData.weixin.openid;
                            var accessToken = authData.weixin.access_token;
                            var expiresIn = authData.weixin.expires_in;

                            var ip = req.ip;
                            ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);
                            // console.log(ip);
                            var notifyUrl = 'http://www.wenwobei.com/notify';
                            //notifyUrl = encodeURIComponent(notifyUrl);

                            wxpay.getBrandWCPayRequestParams({
                                openid: openid,
                                body: '问我-美食',
                                detail: '美食推荐',
                                out_trade_no: '20160331'+Math.random().toString().substr(2, 10),
                                total_fee: totalFee,
                                attach:attach,
                                spbill_create_ip: ip,
                                notify_url:notifyUrl
                            }, function(err, result){
                                // in express
                                // console.log(result);
                                res.send({code:200,payargs:result});
                            });

                        }

                    } else {

                        res.send({code:400,message:'数据有误'});

                    }

                }

            });

        } else {

            res.send({code:400,message:'重复购买'});

        }

    });



});

router.get('/withdrawapply', function(req, res, next) {
    var username = req.query.username;
    var amount = req.query.amount;

    var query = new AV.Query('UserInfo');
    query.equalTo('userName', username);
    query.find().then(function(results) {
        if (results[0].attributes.wallet) {
            var id = results[0].attributes.wallet.id;
            var query = new AV.Query('Wallet');
            query.get(id).then(function (wallet) {
                var money = wallet.get('money');
                if (money < parseFloat(amount)/100) {
                    var result = {
                        code : 700,
                        message : '余额不足'
                    };
                    res.send(result);
                }
                else {
                    wallet.set('money', parseFloat((money-parseFloat(amount)/100).toFixed(2)));
                    wallet.save().then(function (wallet) {
                        var apply = new Apply();
                        apply.set('userName', username);
                        apply.set('amount', amount);
                        apply.save().then(function (apply) {
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

        }


    });
});

router.get('/withdraw', function(req, res, next) {
    //var code = req.query.code;
    var secret = '9157e84975386b6dee6a499cc639973e';
    var username = req.query.username;
    var amount = req.query.amount;
    // console.log(amount);
    // if (code == null) {
    //     var urlApi = "http://www.wenwobei.com/authorization/withdraw?amount="+amount+"&username="+username;
    //     //var urlApi = "/authorization/pay_t";
    //     authorize(res, urlApi);
    //     return;
    // }
    var user = AV.User.current();
    if (user == null || user == '') {
        var result = {
            code : 300,
            message : '用户未登录'
        }
        res.send(result);
        return;
    }
    else {
        var authData = user.get('authData');
        var openid = authData.weixin.openid;
        var accessToken = authData.weixin.access_token;
        var expiresIn = authData.weixin.expires_in;
        var query = new AV.Query('Config');
        var id = '5745403d49830c006265dacb';
        query.get(id).then(function (commission) {
            //for (var i = 0; i < configs.length; i++) {
                //if (configs[i].get('name') == 'commission') {
                    //var commission = parseInt(configs[i].get('value'));
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
                    var reamount = parseInt(amount) - parseInt(amount)*parseInt(commission.get('value'))/100;
                    var id = results[0].attributes.wallet.id;
                    var query = new AV.Query('Wallet');
                    query.get(id).then(function (wallet) {
                        var money = wallet.get('money');
                        if (parseFloat(money) < parseFloat(amount)/100) {
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

                            var appid = config.appid;
                            var mchid = '1298230401';
                            var nonceStr = getNonceStr();
                            //var sign = getSign();
                            var partnerTradeNo = str;
                            //var openid = '';
                            var checkName = 'NO_CHECK';

                            var desc = '提现';
                            var ip = req.ip;
                            ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);
                            //var codeData = result.data;
                            // codeData = JSON.parse(codeData);
                            // var accessToken = codeData.access_token;
                            // var openid = codeData.openid;
                            // var expiresIn = codeData.expires_in;

                            var data = {
                                mch_appid : appid,
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

                            // console.log(data);
                            //console.log(buildXML(data));
                            //return;
                            // getAccessToken(appid, secret, code, res, {
                            //     success:function (result) {

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
                                // console.log(body);
                                parseXML(body, function (err, result) {
                                    // console.log(result);
                                    if (result.return_code == 'SUCCESS' && result.return_msg == '') {
                                        var withdraw = new Withdraw();
                                        withdraw.set('nonceStr', result.nonce_str);
                                        withdraw.set('partnerTradeNo', result.partner_trade_no);
                                        withdraw.set('paymentNo', result.payment_no);
                                        withdraw.set('paymentTime', result.payment_time);
                                        withdraw.set('userName', username);
                                        withdraw.set('amount', amount);
                                        withdraw.save().then(function (post) {
                                            wallet.set('money', parseFloat(parseFloat(money) - parseFloat(amount)/100));
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
                                    else {
                                        var re = {
                                            code : 400,
                                            message : result.return_msg
                                        };
                                        res.send(re);
                                    }
                                });
                            });
                            //     }
                            // });
                        }
                    });

                }
            });
                //}
            //}
        });
    }








});

router.get('/', function(req, res, next) {
    //url = decodeURIComponent(url);
    // console.log(req.query.url);
    var urlReq = decodeURIComponent(req.query.url);
    // console.log(urlReq);
    var appid = config.appid;
    var secret = config.appsecret;

    var code = req.query.code;
    resG = res;
    // console.log("code:" +code);
    
    getAccessToken(appid, secret, code, res,{
        success:function (result) {
            console.log("result" + result.data);
            var codeData = result.data;
            codeData = JSON.parse(codeData);
            var accessToken = codeData.access_token;
            var openid = codeData.openid;
            var expiresIn = codeData.expires_in;

            getUserInfo(accessToken,openid, res,{
                success:function (res) {
                    console.log(res.data);
                    var rdata = res.data;
                    rdata = JSON.parse(rdata);
                    var username = rdata.nickname;
                    var userhead = rdata.headimgurl;
                    var openid = rdata.openid;
                    if (userhead != null && userhead != '') {

                        userhead = userhead.substr(0, userhead.lastIndexOf('/'));
                        userhead += '/';
                    } else {

                        userhead = 'http://www.wenwobei.com/img/logo.jpg';

                    }

                    // console.log('focus');
                    // console.log("accessToken"+accessToken);
                    // console.log("openid" + openid);
                    //
                    //         console.log(focusResult.data);
                    //
                    //         console.log(username);
                    //         console.log(userhead);
                    //         console.log(openid);
                            AV.User._logInWith('weixin', {
                                'authData': {
                                    "openid": openid,
                                    "access_token": accessToken,
                                    "expires_in": expiresIn
                                }
                            }).then(function(user) {
                                //返回绑定后的用户
                                console.log('登录成功');
                                //console.log(user.get('user'));


                                if (user.get('user') != null) {
                                    // console.log('haved');
                                    // var user = AV.User.current();
                                    // console.log(user);
                                    //var url = 'http://www.wenwobei.com/?username='+user.get('user');
                                    var url = urlReq + '?username='+user.get('user');
                                    resG.redirect(url);
                                    return;

                                }
                                else {
                                    // console.log('no');
                                    var post = new Post();
                                    var wallet = new Wallet();
                                    wallet.set('money', 0);
                                    wallet.save().then(function (wallet) {
                                        // console.log(wallet);
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
                                                    //var url = 'http://www.wenwobei.com/?username='+user.get('user');
                                                    var url = urlReq + '?username='+user.get('user');
                                                    resG.redirect(url);
                                                    return;


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
    // var url = 'http://www.wenwobei.com/';
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
    var appid = config.appid;
    var secret = config.appsecret;

    //var urlApi = "http://www.wenwobei.com/authorization/";
    urlApi = encodeURIComponent(urlApi);
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

    res.redirect(url);
}
function authorizeNotInfo(res,urlApi) {
    var appid = config.appid;
    var secret = config.appsecret;

    //var urlApi = "http://www.wenwobei.com/authorization/";
    urlApi = encodeURIComponent(urlApi);
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_base&state=1#wechat_redirect';

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

function getNormalAccessToken(appid, secret, callback) {

    AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appid+'&secret='+config.appsecret,
        success: function(httpResponse) {

            callback.success(httpResponse);

        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });

}

function isFocus(openId, token, callback) {

    AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openId+'&lang=zh_CN ',
        success: function(httpResponse) {
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
