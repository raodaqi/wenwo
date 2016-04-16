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
    post.set('userName', userName);
    post.set('userHead', userhead);
    user.set('userInfo', post);
    user.set('wallet', wallet);
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

    AV.User.logIn(userName, password).then(function(callback) {
        var session_token = AV.User.current()._sessionToken;
        var query = new AV.Query('UserInfo');

        getUserId(userName, {
            success:function (result) {
                console.log(result);
                var user_id = result;

                //console.log(user_id);
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
                testToken(session_token);
                res.send(result);
            },
            error: function (error) {

            }
        });


    }, function() {
        //console.log('登录失败');
    });
});

router.post('/getuserinfo', function(req, res, next) {
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
    if (!sessionToken) {
        var result = {
            code : 300,
            message : 'miss parameter : sessionToken'
        }
        res.send(result);
        return;
    }
    // if (!testToken(sessionToken, userName)) {
    //     var result = {
    //         code : 500,
    //         message : 'login information error'
    //     }
    //     res.send(result);
    //     return;
    // }
    var query = new AV.Query('UserInfo');

    query.equalTo('userName', userName);
    query.find().then(function(results) {
        console.log(results[0]);
        var userId = results[0].id;
        var userName = results[0].attributes.userName;
        var userHead = results[0].attributes.userHead;

        var data = {
            user_id :userId,
            user_name : userName,
            user_head : userHead
        }
        var resulte = {
            code : 200,
            data : data,
            message : 'operation successed'
        }
    }, function(error) {
        console.log('def');
    });

});

function getUserId(userName,callback) {
    var query = new AV.Query('UserInfo');

    query.equalTo('userName', userName);
    query.find().then(function(results) {
        //console.log(results[0].id);
        var user_id = results[0].id;
        callback.success(user_id);
    }, function(error) {

    });
}

function testToken(token, userName) {
    AV.User.become(token).then(function (user) {
        console.log(user.attributes.username);
        if (user.attributes.username == userName) {
            return true;
        }
        else {
            return false;
        }
    }, function (error) {

    });
}

module.exports = router;
