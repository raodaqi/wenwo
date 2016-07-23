/**
 * Created by HanQi on 16/4/14.
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Post = AV.Object.extend('UserInfo');
var Wallet = AV.Object.extend('Wallet');
var Suggestion = AV.Object.extend('Suggestion');


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
            user : user,
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

    var openid = req.body.openid;
    var accessToken = req.body.access_token;
    var expiresIn = req.body.expires_in;


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
            // var url = urlReq + '?username='+user.get('user');
            // resG.redirect(url);
            res.send({code:200,data:{username:user.get('user')},message:'操作成功'});


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
                            // var url = urlReq + '?username='+user.get('user');
                            // resG.redirect(url);

                            res.send({code:200,data:{username:user.get('user')},message:'操作成功'});
                        });
                    });

                });
            });

        }


    }, function(error) {
        console.log(error);
        res.send({code:400,message:error});
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
    query.equalTo('user', userName);
    query.find().then(function(results) {
        console.log(results);
        if(results == '') {
            var resulte = {
                code : 890,
                message : '没有该用户'
            }
            res.send(resulte);
            return;
        }
        var userId =  results[0].get('userInfo').id;
        var que = new AV.Query('UserInfo');
        que.get(userId).then(function(post) {
            console.log(post.get('userHead'));
            // var data = {
            //     user_id :userId,
            //     user_name : userName,
            //     user_head : post.get('userHead')
            // }
            var resulte = {
                code : 200,
                data : post,
                message : 'operation successed'
            }
            res.send(resulte);
        });
    });



});

router.post('/suggestion', function (req, res, next) {
    var view = req.param('view');
    var contact = req.param('contact');

    var suggestion = new Suggestion();
    suggestion.set('view', view);
    suggestion.set('contact', contact);
    suggestion.save().then(function (post) {
        console.log(post);
        var result = {
            code : 200,
            message : 'operation succeeded'
        }
        res.send(result);
    });
});

router.post('/getInfo', function (req, res, next) {

    var userName = req.body.username;

    var query = new AV.Query('UserInfo');
    query.include('wallet');
    query.get(userName).then(function (user) {

        if (user == null || user == '') {

            var result = {
                code : 500,
                message : '未找到该用户'
            }
            res.send(result);

        } else {

            var userShowName = user.get('uName');
            var userHead = user.get('userHead');

            var query = new AV.Query('FoodLike');
            query.equalTo('by', userName);
            query.find().then(function (foodLikeList) {

                var foodLikeListCount = foodLikeList.length;

                var query = new AV.Query('AskMe');
                query.equalTo('createBy', userName);
                query.find().then(function (askList) {

                    var askListCount = askList.length;

                    var totalIncome = user.get('wallet').get('total');
                    // console.log(user.get('wallet').get('total'));

                    var query = new AV.Query('Haved');
                    query.equalTo('by', userName);
                    query.find().then(function (buyList) {

                        var buyListCount = buyList.length;


                        var data = {

                            foodLikeListCount:foodLikeListCount,
                            userShowName:userShowName,
                            userHead:userHead,
                            askListCount:askListCount,
                            totalIncome:totalIncome,
                            buyListCount:buyListCount


                        };

                        console.log(data);

                        var result = {
                            code : 200,
                            data : data,
                            message : 'operation succeeded'
                        };
                        res.send(result);


                    });

                });

            });



        }
    });

});

module.exports = router;
