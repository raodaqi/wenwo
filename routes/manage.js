/**
 * Created by HanQi on 16/4/27.
 */

var router = require('express').Router();
var AV = require('leanengine');
var Admin = AV.Object.extend('AdminAccount');

router.get('/', function(req, res, next) {
    var user = AV.User.current();
    if(!user){
        res.redirect('manage/signin');
    }else{
        var username = user.get('user');
        res.render('manage/index',{username:username});
    }
    res.render('manage/index');
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
    var query = new AV.Query('AdminAccount');
    query.find().then(function (resultes) {
        for (var i = 0; i < resultes.length; i++) {
            if (resultes[i].get('adminName') == adminName) {
                var result = {
                    code : 600,
                    message : '该用户名已经被注册'
                }
                res.send(result);
                return;
            }
        }
        var account = new Admin();
        account.set('adminName', adminName);
        account.set('password', password);
        account.save().then(function (account) {
            var result = {
                code : 200,
                message : '操作成功'
            }
            res.send(result);
            return;
        });
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
    var query = new AV.Query('AdminAccount');
    query.find().then(function (resultes) {
        for (var i = 0; i < resultes.length; i++ ) {
            if (resultes[i].get('adminName') == name && resultes[i].get('password') == password) {
                var result = {
                    code : 200,
                    user : resultes[i].get('adminName'),
                    message : '登录成功'
                }
                res.send(result);
                return;
            }
        }
        var result = {
            code : 400,
            message : '用户名或密码错误'
        }
        res.send(result);
        return;
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
