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
        console.log(username);
        res.render('manage/index',{username:username});
    }
    // res.render('manage/index');
});

router.get('/signin', function(req, res, next) {
    res.render('manage/signin');
});

router.get('/signup', function(req, res, next) {
    res.render('manage/signup');
});

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
        console.log(user);
        var result = {
            code : 200,
            user:user,
            message : '操作成功'
        }
        res.send(result);
        return;
    }, function(error) {
        // 失败了
        console.log('Error: ' + error.code + ' ' + error.message);
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
        console.log(list);
        var result = {
            code : 200,
            data:list,
            message : 'operation successed'
        }
        res.send(result);
    });
});


module.exports = router;
