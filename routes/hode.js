/**
 * Created by HanQi on 16/4/20.
 *
 * staus = 1   购买
 * staus = 2   收藏
 * staus = 3   所有
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var User = AV.Object.extend('UserInfo');
var Ask =  AV.Object.extend('AskMe');
var Haved = AV.Object.extend('Haved');
var Wallet = AV.Object.extend('Wallet');

router.post('/haved', function(req, res, next) {
    var userName = req.param('username');
    var staus = req.param('staus');
    var query = new AV.Query('UserInfo');
    if (staus != '3') {
        query.equalTo('type', staus);
    }
    query.equalTo('userName', userName);
    query.find().then(function (resultes) {
        var relation = resultes[0].relation('haved');
        relation.query().find().then(function (list) {
            console.log(list);
            // for (var i = 0; i < list.length; i++) {
            //     var query = new AV.Query('AskMe');
            //     query.get(list[i].attributes.ask.objectId).then(function (ask) {
            //         list[i].attributes.ask.data = ask;
            //     });
            // }
            var result = {
                code : 200,
                data:list,
                message : 'operation successed'
            }
            res.send(result);
            return;
        });
    });
});

router.post('/get', function(req, res, next) {
    var userName = req.param('username');
    //var staus = req.param('staus');// 1 收藏, 2购买
    var askId = req.param('ask_id');
    var query = new AV.Query('AskMe');
    query.get(askId).then(function (post) {
        console.log(post);
        var num = post.get("buyNum");
        num = (parseInt(num) + 1).toString();
        post.set('buyNum', num);
        post.save().then(function (post) {
            if (post.get('askIsFree') == '1') {//收藏
                var query = new AV.Query('UserInfo');
                query.equalTo('userName', userName);
                query.find().then(function (resultes) {
                    //console.log(resultes[0].attributes.haved);
                    var relation = resultes[0].relation('haved');
                    var have = new Haved();
                    have.set('ask', post);
                    have.set('type', '1');
                    have.save().then(function (result) {
                        console.log(result);
                        relation.add(result);
                        resultes[0].save();
                        var result = {
                            code : 200,
                            message : 'operation successed'
                        }
                        res.send(result);
                        return;
                    });

                });
            }
            else {//购买
                var query = new AV.Query('UserInfo');
                query.equalTo('userName', userName);
                query.find().then(function (resultes) {
                    console.log(resultes[0]);
                    // var relation = resultes[0].relation('haved');
                    // relation.query().find().then(function (list) {
                    //     console.log(list);
                    // });
                    console.log(post.get('askPrice'));
                    var price = parseFloat(post.get('askPrice'));
                    var query = new AV.Query('Wallet');
                    query.get(resultes[0].attributes.wallet.id).then(function (wallet) {
                        console.log(wallet.get('money'));
                        var money = parseFloat(wallet.get('money'));
                        //console.log(money-price);
                        if ((money-price) < 0) {
                            var result = {
                                code : 600,
                                message : 'not sufficient funds'
                            }
                            res.send(result);
                            return;
                        }
                        else {
                            console.log((money-price).toString());
                            wallet.set('money', (money-price));
                            wallet.save().then(function () {

                            },function (error) {
                                console.log('Error: ' + error.code + ' ' + error.message);
                            });
                            var relation = resultes[0].relation('haved');
                            var have = new Haved();
                            have.set('ask', post);
                            have.set('type', '2');
                            have.save().then(function (result) {
                                console.log(result);
                                relation.add(result);
                                resultes[0].save();

                                var result = {
                                    code : 200,
                                    message : 'operation successed'
                                }
                                res.send(result);
                                return;
                            });
                        }
                    });

                });
            }
        }, function(error) {
            // 失败
            console.log('Error: ' + error.code + ' ' + error.message);
        });

    });
});

router.post('/del', function(req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');

    var query = new AV.Query('UserInfo');
    query.equalTo('userName', userName);
    query.find().then(function (resultes) {
        //console.log(resultes[0]);
        var relation = resultes[0].relation('haved');
        relation.query().find().then(function (list) {
            console.log(list);
            var flag = 0;
            for (var i = 0; i < list.length; i++) {
                //console.log(list[i].attributes.ask.id);
                //console.log(askId);
                if (list[i].attributes.ask.id == askId) {
                    //console.log('remove');
                    console.log(list[i]);
                    relation.remove(list[i]);
                    list[i].destroy();
                    resultes[0].save().then(function () {
                        var query = new AV.Query('AskMe');
                        query.get(askId).then(function (post) {
                            var num = post.get("buyNum");
                            num = (parseInt(num) - 1).toString();
                            post.set('buyNum', num);
                            post.save();
                        });
                    });
                    flag++;
                }
            }
            if (flag == 0) {
                var result = {
                    code : 400,
                    message : 'not yet have this ask'
                }
                res.send(result);
                return;
            }
            else  {
                var result = {
                    code : 200,
                    message : 'operation successed'
                }
                res.send(result);
                return;
            }
        });
    });
});

router.post('/refund', function(req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');

    var query = new AV.Query('UserInfo');
    query.equalTo('userName', userName);
    query.find().then(function (resultes) {
        //console.log(resultes[0]);
        var relation = resultes[0].relation('haved');
        relation.query().find().then(function (list) {
            console.log(list);
            var flag = 0;
            for (var i = 0; i < list.length; i++) {
                //console.log(list[i].attributes.ask.id);
                //console.log(askId);
                if (list[i].attributes.ask.id == askId) {
                    //console.log('remove');
                    console.log(list[i]);
                    relation.remove(list[i]);
                    list[i].destroy();
                    resultes[0].save().then(function () {
                        var query = new AV.Query('AskMe');
                        query.get(askId).then(function (post) {
                            var num = post.get("buyNum");
                            num = (parseInt(num) - 1).toString();
                            post.set('buyNum', num);
                            post.save().then(function (post) {
                                var price = parseFloat(post.get('askPrice'));
                                var query = new AV.Query('Wallet');
                                query.get(resultes[0].attributes.wallet.id).then(function (wallet) {
                                    console.log(wallet.get('money'));
                                    var money = parseFloat(wallet.get('money'));
                                    console.log((money+price).toString());
                                    wallet.set('money', (money+price));
                                    wallet.save().then(function () {

                                    },function (error) {
                                        console.log('Error: ' + error.code + ' ' + error.message);
                                    });

                                });
                            });

                        });
                    });
                    flag++;
                }
            }
            if (flag == 0) {
                var result = {
                    code : 400,
                    message : 'not yet have this ask'
                }
                res.send(result);
                return;
            }
            else  {
                var result = {
                    code : 200,
                    message : 'operation successed'
                }
                res.send(result);
                return;
            }
        });
    });
});


module.exports = router;


