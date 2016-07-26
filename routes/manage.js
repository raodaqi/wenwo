/**
 * Created by HanQi on 16/4/27.
 */

var router = require('express').Router();
var AV = require('leanengine');
var Admin = AV.Object.extend('AdminAccount');

var qiniu = require("qiniu");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'DU0ZyfvC06whs4kFM65I4uGlnDkCeyLMV6ct4NPF';
qiniu.conf.SECRET_KEY = 'wvt3V7LrhJi6sPefoL1mRB3PsRV_KUUucd3QNmAz';


router.get('/token', function(req, res) {
 
  var uptoken = new qiniu.rs.PutPolicy("wenwo");

  var token = uptoken.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});

router.get('/', function(req, res, next) {
    var user = AV.User.current();
    if(!user){
        res.redirect('manage/signin');
    }else{
        var username = user.get('username');
        // console.log(username);
        res.render('manage/index',{username:username});
    }
    // res.render('manage/index');
});

router.get('/signin', function(req, res, next) {
    res.render('manage/signin');
});

// router.get('/signup', function(req, res, next) {
//     res.render('manage/signup');
// });

router.post('/regist', function(req, res, next) {
    var adminName = req.param('name');
    var password = req.param('password');

    if (adminName == '' || adminName == null) {
        var result = {
            code : 400,
            message : '缺少参数name'
        }
        res.send(result);
        return;
    }
    if (password == '' || password == null) {
        var result = {
            code : 400,
            message : '缺少参数password'
        }
        res.send(result);
        return;
    }
    // var query = new AV.Query('AdminAccount');
    // query.find().then(function (resultes) {
    //     for (var i = 0; i < resultes.length; i++) {
    //         if (resultes[i].get('adminName') == adminName) {
    //             var result = {
    //                 code : 600,
    //                 message : '该用户名已经被注册'
    //             }
    //             res.send(result);
    //             return;
    //         }
    //     }
    //     var account = new Admin();
    //     account.set('adminName', adminName);
    //     account.set('password', password);
    //     account.save().then(function (account) {
    //         var result = {
    //             code : 200,
    //             message : '操作成功'
    //         }
    //         res.send(result);
    //         return;
    //     });
    // });
    var user = new AV.User();
    user.set('username', adminName);
    user.set('password', password);
    //user.set('email', 'hang@leancloud.rocks');

// other fields can be set just like with AV.Object
    //user.set('phone', '186-1234-0000');
    user.signUp().then(function(user) {
        // 注册成功，可以使用了
        // console.log(user);
        var result = {
            code : 200,
            user:user,
            message : '操作成功'
        }
        res.send(result);
        return;
    }, function(error) {
        // 失败了
        // console.log('Error: ' + error.code + ' ' + error.message);
        var result = {
            code : 400,
            message : error.message
        }
        res.send(result);
    });
});

router.post('/login', function (req, res, next) {
    var name = req.param('name');
    var password = req.param('password');
    if (name == '' || name == null) {
        var result = {
            code : 400,
            message : '缺少参数name'
        }
        res.send(result);
        return;
    }
    if (password == '' || password == null) {
        var result = {
            code : 400,
            message : '缺少参数password'
        }
        res.send(result);
        return;
    }
    // var query = new AV.Query('AdminAccount');
    // query.find().then(function (resultes) {
    //     for (var i = 0; i < resultes.length; i++ ) {
    //         if (resultes[i].get('adminName') == name && resultes[i].get('password') == password) {
    //             var result = {
    //                 code : 200,
    //                 user : resultes[i],
    //                 message : '登录成功'
    //             }
    //             res.send(result);
    //             return;
    //         }
    //     }
    //     var result = {
    //         code : 400,
    //         message : '用户名或密码错误'
    //     }
    //     res.send(result);
    //     return;
    // });
    AV.User.logIn(name, password).then(function() {
        // 成功了，现在可以做其他事情了
        var user = AV.User.current();
        var result = {
            code : 200,
            user:user,
            message : '操作成功'
        }
        res.send(result);
    }, function() {
        // 失败了
        var result = {
            code : 400,
            message : '登录失败'
        }
        res.send(result);
    });
});

router.get('/getviews', function(req, res, next) {
    var query = new AV.Query('Suggestion');
    query.find().then(function (list) {
        // console.log(list);
        var result = {
            code : 200,
            data:list,
            message : 'operation successed'
        }
        res.send(result);
    });
});

router.get('/getapply', function(req, res, next) {
    var query = new AV.Query('Apply');
    query.addAscending('updatedAt');
    query.find().then(function (applys) {
        var result = {
            code : 200,
            data: applys,
            message : 'operation successed'
        }
        res.send(result);
    });
});

router.get('/applyinfo', function(req, res, next) {
    // var user = AV.User.current();
    // if (user == null || user == '') {
    //     var result = {
    //         code : 300,
    //         message : '用户未登录'
    //     };
    //     res.send(result);
    //     return;
    // }
    // var applyId = req.query.apply_id;
    // var staus = req.query.staus; //staus = 0 未处理  = 1 通过  =2 失败
    // var query = new AV.Query('Apply');
    // query.get(applyId).then(function (apply) {
    //     apply.set('staus', staus);
    //     apply.set('operationBy', user.get('username'));
    //     apply.save().then(function (apply) {
    //         if (staus == '2') {
    //             var result = {
    //                 code : 200,
    //                 data: apply,
    //                 message : 'operation successed'
    //             }
    //             res.send(result);
    //         }
    //         else if (staus == '1') {
    //
    //         }
    //     });
    // })

    var userName = req.query.username;
    var amount = req.query.amount;

    //var applyId = req.query.apply_id;
    //var query = new AV.Query('Apply');
    //query.get(applyId).then(function (apply) {
        //var userName = apply.get('userName');
        //var amount = apply.get('amount');
    // console.log(userName);
    // console.log(amount);


        // var query = new AV.Query('AskMe');
        // query.equalTo('createBy', userName);
        // query.find().then(function (resultes) {
        //     var totalGet = 0;
        //     for (var i = 0; i < resultes.length; i++) {
        //         totalGet += (parseFloat(resultes[i].get('askPrice')) * parseInt(resultes[i].get('buyNum')));
        //     }
        //     console.log('tatalGet:' + totalGet);
        //     var query = new AV.Query('Haved');
        //     query.equalTo('by', userName);
        //     query.find().then(function (haved) {
        //         var totalHaved = 0;
        //         for (var i = 0; i < haved.length; i++) {
        //             totalHaved += parseFloat(haved[i].get('price'));
        //         }
        //         console.log('totalHaved:' + totalHaved);
        //         var query = new AV.Query('Withdraw');
        //         query.equalTo('userName', userName);
        //         query.find().then(function (withdraw) {
        //             var withdrawTotal = 0;
        //             for (var i = 0; i < withdraw.length; i++) {
        //                 withdrawTotal += parseFloat(withdraw[i].get('amount')/100);
        //             }
        //             console.log('withdrawTotal:' + withdrawTotal);
        //             var data = {
        //                 totalGet : parseFloat(totalGet).toFixed(2),
        //                 totalHaved : parseFloat(totalHaved).toFixed(2),
        //                 withdrawTotal : parseFloat(withdrawTotal).toFixed(2),
        //                 thisWithdraw : parseFloat(parseFloat(amount) / 100).toFixed(2)
        //             }
        //             var result = {
        //                 code : 200,
        //                 data: data,
        //                 message : 'operation successed'
        //             }
        //             res.send(result);
        //         });
        //     });
        // });


        var query = new AV.Query('Haved');
        query.equalTo('askOwn', userName);
        query.limit(1000);
        query.find().then(function (saleList) {
            var query = new AV.Query('Haved');
            query.equalTo('by', userName);
            query.limit(1000);
            query.find().then(function (buyList) {
                var query = new AV.Query('Order');
                query.equalTo('userName', userName);
                query.limit(1000);
                query.find().then(function (payList) {
                    var query = new AV.Query('Withdraw');
                    query.equalTo('userName', userName);
                    query.limit(1000);
                    query.find().then(function (withdrawList) {
                        var data = {
                            saleList:saleList,
                            buyList:buyList,
                            payList:payList,
                            withdrawList:withdrawList
                        };
                        var result = {
                            code : 200,
                            data: data,
                            message : 'operation successed'
                        }
                        res.send(result);
                    });
                });
            });
        });



    //});

});

router.get('/apply', function(req, res, next) {
    var user = AV.User.current();
    if (user == null || user == '') {
        var result = {
            code : 300,
            message : '用户未登录'
        };
        res.send(result);
        return;
    }
    var applyId = req.query.apply_id;
    var staus = req.query.staus; //staus = 0 未处理  = 1 通过  =2 失败
    var query = new AV.Query('Apply');
    query.get(applyId).then(function (apply) {
        apply.set('staus', staus);
        apply.set('operationBy', user.get('username'));
        apply.save().then(function (apply) {
            if (staus == '2') {
                var result = {
                    code : 200,
                    data: apply,
                    message : 'operation successed'
                }
                res.send(result);
            }
            else if (staus == '1') {
                var secret = '9157e84975386b6dee6a499cc639973e';
                var username = apply.get('userName');
                var amount = apply.get('amount');
                // console.log(amount);
                // if (code == null) {
                //     var urlApi = "http://wenwo.leanapp.cn/authorization/withdraw?amount="+amount+"&username="+username;
                //     //var urlApi = "/authorization/pay_t";
                //     authorize(res, urlApi);
                //     return;
                // }
                // var user = AV.User.current();
                // if (user == null || user == '') {
                //     var result = {
                //         code : 300,
                //         message : '用户未登录'
                //     }
                //     res.send(result);
                //     return;
                // }
                //else {
                var query = new AV.Query('Apply');
                query.equalTo('user', username);
                query.first().then(function (user) {
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
                                                        //wallet.set('money', parseFloat(parseFloat(money) - parseFloat(amount)/100));
                                                        //wallet.save().then(function (wallet) {
                                                            var result = {
                                                                code : 200,
                                                                data : wallet,
                                                                message : 'Operation succeeded'
                                                            };
                                                            res.send(result);
                                                        //});

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
                });

                //}





            }
        });
    })
});

module.exports = router;
