/**
 * Created by HanQi on 16/4/14.
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Post = AV.Object.extend('UserInfo');
var Wallet = AV.Object.extend('Wallet');


router.get('/regist', function(req, res, next) {
    var userName = req.param('username');
    var password = req.param('password');
    var userhead = req.param('userhead');
    if (!userName) {
        var result = {
            code : 300,
            message : 'miss parameter : username'
        }
        res.send(result);
        return;
    }
    if (!password) {
        var result = {
            code : 300,
            message : 'miss parameter : password'
        }
        res.send(result);
        return;
    }
    var user = new AV.User();
    var post = new Post();
    var wallet = new Wallet();
    wallet.set('money', 0);
    wallet.save();
    post.set('userName', userName);
    post.set('userHead', userhead);
    user.set('userInfo', post);
    post.set('wallet', wallet);
    user.set('username', userName);
    user.set('password', password);
    user.signUp().then(function(user) {
        var result = {
            code : 200,
            message : 'operation succeeded'
        }
        res.send(result);
    }, function(error) {
        var result = {
            code : 100,
            message : error.message
        }
        res.send(result);
    });
});

router.post('/login', function (req, res, next) {
    var userName = req.param('username');
    var password = req.param('password');

    if (!userName) {
        var result = {
            code : 300,
            message : 'miss parameter : username'
        }
        res.send(result);
        return;
    }
    if (!password) {
        var result = {
            code : 300,
            message : 'miss parameter : password'
        }
        res.send(result);
        return;
    }

    AV.User.logIn(userName, password).then(function() {
        var session_token = AV.User.current()._sessionToken;
        var query = new AV.Query('UserInfo');

        query.equalTo('userName', userName);
        query.find().then(function(results) {
            //console.log(results[0]);
            var user_id = results[0].id;
            query.get(user_id).then(function(post) {

                //console.log(post);
                post.set('token', session_token);
                post.save();
            }, function(error) {
                // 失败了
            });
            var data = {
                session_token : session_token,
                user_id : user_id,
                user_name : userName
            }
            var result = {
                code : 200,
                data : data,
                message : 'operation succeeded'
            }
            res.send(result);
        }, function(error) {

        });



    }, function() {
        //console.log('登录失败');
    });
});

router.get('/getuserinfo', function(req, res, next) {
    var sessionToken = req.param('session_token');
    var userName = req.param('username');
    if (!userName) {
        var result = {
            code : 300,
            message : 'miss parameter : username'
        }
        res.send(result);
        return;
    }

    // if (!sessionToken) {
    //     var result = {
    //         code : 300,
    //         message : 'miss parameter : sessionToken'
    //     }
    //     res.send(result);
    //     return;
    // }
    var query = new AV.Query('_User');
    query.equalTo('username', userName);
    query.find().then(function(results) {
        //console.log(results[0].get('userInfo').id);
        var userId =  results[0].get('userInfo').id;
        var que = new AV.Query('UserInfo');
        que.get(userId).then(function(post) {
            console.log(post.get('userHead'));
            var data = {
                user_id :userId,
                user_name : userName,
                user_head : post.get('userHead')
            }
            var resulte = {
                code : 200,
                data : data,
                message : 'operation successed'
            }
            res.send(resulte);
        });
    });



});



module.exports = router;
