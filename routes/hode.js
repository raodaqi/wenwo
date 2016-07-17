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
var RefundInfo = AV.Object.extend('RefundInfo');
var FoodLike = AV.Object.extend('FoodLike');

router.post('/haved', function(req, res, next) {
    var userName = req.param('username');
    var staus = req.param('staus');
    var query = new AV.Query('UserInfo');
    query.equalTo('userName', userName);
    query.find().then(function (resultes) {
        if (resultes == null || resultes == '') {
            var result = {
                code : 400,
                data:'',
                message : '没有该用户'
            }
            res.send(result);
        }
        var relation = resultes[0].relation('haved');
        if (relation == null || relation == '') {
            var result = {
                code : 200,
                data:'',
                message : 'operation successed'
            }
            res.send(result);
        }
        //relation.include('ask');
        // if (staus != '3') {
        //     relation.equalTo('type', staus);
        // }
        relation.query().find().then(function (list) {
            console.log(list);

            // for (var i = 0; i < list.length; i++) {
            //     var query = new AV.Query('AskMe');
            //     query.get(list[i].attributes.ask.objectId).then(function (ask) {
            //         list[i].attributes.ask.data = ask;
            //     });
            // }
            if (staus == 3) {
                var result = {
                    code : 200,
                    data:list,
                    message : 'operation successed'
                }
                res.send(result);
            }
            var data = new Array();
            var j = 0;
            for (var i = 0; i <  list.length; i++) {
                if (list[i].get('type') == staus) {
                    data[j] = list[i];
                    j++;
                }
            }

            var result = {
                code : 200,
                data:data,
                message : 'operation successed'
            }
            res.send(result);
            return;
        });
    });
});

router.post('/get', function(req, res, next) {
    var userName = req.param('username');
    var askId = req.param('ask_id');
    //var staus = req.param('staus');// 1 收藏, 2购买
    var query = new AV.Query('UserInfo');
    query.get(userName).then(function (user) {
        var relation = user.relation('haved');
        relation.query().find().then(function (list) {
            var flag = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i].get('ask').objectId == askId) {
                    flag++;
                    break;
                }
            }
            if(flag != 0) {
                var result = {
                    code : 880,
                    message : '已经购买/收藏'
                };
                res.send(result);
                return;
            }
            else {
                var query = new AV.Query('AskMe');
                query.get(askId).then(function (post) {
                    console.log(post);
                    // var num = post.get("buyNum");
                    // num = (parseInt(num) + 1).toString();
                    // post.set('buyNum', num);

                    var buyRelation = post.relation('haved');
                    post.save().then(function (post) {
                        if (post.get('askIsFree') == '1' && parseFloat(post.get('askPrice')) == 0) {//收藏
                            var query = new AV.Query('UserInfo');
                            query.equalTo('userName', userName);
                            query.find().then(function (resultes) {
                                //console.log(resultes[0].attributes.haved);
                                var relation = resultes[0].relation('haved');
                                var have = new Haved();
                                have.set('ask', post);
                                have.set('type', '1');
                                have.set('by', userName);
                                have.set('askDate', post.updatedAt);
                                have.set('price', post.get('askPrice'));
                                have.set('byName', user.get('uName'));
                                have.set('byUrl', user.get('userHead'));
                                have.set('askOwn', post.get('createBy'));
                                have.save().then(function (result) {
                                    console.log(result);
                                    relation.add(result);
                                    buyRelation.add(result);
                                    resultes[0].save().then(function () {
                                        post.save().then(function () {
                                            var query = new AV.Query('AskMe');
                                            query.get(askId).then(function (ask) {
                                                var relation = ask.relation('haved');
                                                if (relation == '' || relation == null) {
                                                    var num = 0;
                                                    ask.set('buyNum', num.toString());
                                                    ask.set('score', (parseInt(ask.get('score')) + 1).toString());
                                                    ask.save().then(function (ask) {
                                                        var result = {
                                                            code : 200,
                                                            data : ask,
                                                            message : '操作成功'
                                                        }
                                                        res.send(result);
                                                        return;
                                                    });
                                                }
                                                else {
                                                    relation.query().find().then(function (list) {
                                                        var num = list.length;
                                                        ask.set('buyNum', num.toString());
                                                        ask.set('score', (parseInt(ask.get('score')) + 1).toString());
                                                        ask.save().then(function (ask) {
                                                            var result = {
                                                                code : 200,
                                                                data : ask,
                                                                message : '操作成功'
                                                            }
                                                            res.send(result);
                                                            return;
                                                        });
                                                    });
                                                }

                                            });

                                        });

                                    });

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
                                            message : '余额不足'
                                        };
                                        res.send(result);
                                        return;
                                    }
                                    else {
                                        console.log((money-price).toString());
                                        wallet.set('money', parseFloat((money-price).toFixed(2)));
                                        wallet.save().then(function () {
                                            var relation = resultes[0].relation('haved');
                                            var have = new Haved();
                                            have.set('ask', post);
                                            have.set('type', '2');
                                            have.set('by', userName);
                                            have.set('askDate', post.updatedAt);
                                            have.set('price', post.get('askPrice'));
                                            have.set('byName', user.get('uName'));
                                            have.set('byUrl', user.get('userHead'));
                                            have.set('askOwn', post.get('createBy'));
                                            have.save().then(function (result) {
                                                console.log(result);
                                                relation.add(result);
                                                buyRelation.add(result);
                                                resultes[0].save().then(function () {
                                                    post.save().then(function () {
                                                        var query = new AV.Query('AskMe');
                                                        query.get(askId).then(function (ask) {
                                                            var byId = ask.get('createBy');
                                                            var query = new AV.Query('UserInfo');
                                                            query.get(byId).then(function (user) {
                                                                if (user.attributes.wallet) {
                                                                    var id = user.attributes.wallet.id;
                                                                    var query = new AV.Query('Wallet');
                                                                    query.get(id).then(function (wallet) {
                                                                        //console.log(wallet);
                                                                        console.log('money'+parseFloat((wallet.get('money')+price)).toFixed(2));
                                                                        wallet.set('money', parseFloat(parseFloat((wallet.get('money')+price)).toFixed(2)));
                                                                        wallet.save().then(function (re) {
                                                                            var relation = ask.relation('haved');
                                                                            if (relation == '' || relation == null) {
                                                                                var num = 0;
                                                                                ask.set('buyNum', num.toString());
                                                                                ask.set('score', (parseInt(ask.get('score')) + 1).toString());
                                                                                ask.save().then(function (ask) {
                                                                                    var result = {
                                                                                        code : 200,
                                                                                        data : ask,
                                                                                        message : '操作成功'
                                                                                    }
                                                                                    res.send(result);
                                                                                    return;
                                                                                });
                                                                            }
                                                                            else {
                                                                                relation.query().find().then(function (list) {
                                                                                    var num = list.length;
                                                                                    console.log('num:'+num);
                                                                                    ask.set('buyNum', num.toString());
                                                                                    ask.set('score', (parseInt(ask.get('score')) + 1).toString());
                                                                                    ask.save().then(function (ask) {
                                                                                        var result = {
                                                                                            code : 200,
                                                                                            data : ask,
                                                                                            message : '操作成功'
                                                                                        }
                                                                                        res.send(result);
                                                                                        return;
                                                                                    });
                                                                                });
                                                                            }
                                                                        });
                                                                    });

                                                                }
                                                            });

                                                        });

                                                    });

                                                });
                                            });
                                        },function (error) {
                                            console.log('Error: ' + error.code + ' ' + error.message);
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
            }

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
    var refundInfos = req.param('refundInfo');
    console.log(refundInfos);

    var query = new AV.Query('UserInfo');
    query.equalTo('userName', userName);
    query.find().then(function (resultes) {
        //console.log(resultes[0]);
        var relation = resultes[0].relation('haved');
        relation.query().find().then(function (list) {
            //console.log(list);
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
                            var refundInfo = new RefundInfo();
                            console.log(refundInfos);
                            refundInfo.set('info', refundInfos);
                            refundInfo.set('userName', userName);
                            refundInfo.set('by', resultes[0].get('uName'));
                            refundInfo.set('byUrl', resultes[0].get('userHead'));
                            refundInfo.save().then(function (result) {
                                var relation = post.relation('refundInfo');
                                relation.add(result);
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
                                        wallet.set('money', (money+price).toFixed(2));
                                        wallet.save().then(function () {
                                            var result = {
                                                code : 200,
                                                message : 'operation successed'
                                            }
                                            res.send(result);
                                            return;
                                        },function (error) {
                                            console.log('Error: ' + error.code + ' ' + error.message);
                                        });

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
                    message : '未购买'
                }
                res.send(result);
                return;
            }



        });
    });
});

router.post('/foodlike', function(req, res, next) {
    var userName = req.body.username;

    var askId = req.body.ask_id;

    var query = new AV.Query('UserInfo');
    query.get(userName).then(function (user) {

        var query = new AV.Query('AskMe');
        query.get(askId).then(function (ask) {

            var query = new AV.Query('FoodLike');

            query.equalTo("by", userName);
            query.find().then(function (fooLikes) {
                var flag = 0;
                for (var i = 0; i<fooLikes.length; i++) {
                    if (fooLikes[i].get('ask').id == askId) {

                        flag++;
                        break;
                    }

                }
                if (flag == 0) {

                    var foodLike = new FoodLike();
                    foodLike.set('ask', ask);
                    foodLike.set('by', userName);
                    foodLike.set('byName', user.get('uName'));
                    foodLike.set('byUrl', user.get('userHead'));
                    ask.set('likeNum', (parseInt(ask.get('likeNum'))+1).toString());
                    foodLike.save().then(function (re) {

                        ask.set('score', (parseInt(ask.get('score')) + 1).toString());
                        ask.save().then(function () {
                            var result = {
                                code : 200,
                                data : re,
                                message : '操作成功'
                            };
                            res.send(result);


                        });


                    });



                } else  {

                    var result = {
                        code : 400,
                        message : '重复操作'
                    };
                    res.send(result);



                }
            });

        });
        
    });
});

router.post('/cancelfoodlike', function(req, res, next) {
    var userName = req.body.username;

    var askId = req.body.ask_id;

    var query = new AV.Query('UserInfo');
    query.get(userName).then(function (user) {

        var query = new AV.Query('AskMe');
        query.get(askId).then(function (ask) {

            var query = new AV.Query('FoodLike');

            query.equalTo("by", userName);
            query.find().then(function (fooLikes) {
                var flag = 0;
                for (var i = 0; i<fooLikes.length; i++) {
                    if (fooLikes[i].get('ask').id == askId) {

                        console.log(fooLikes[i].id);

                        var todo = AV.Object.createWithoutData('FoodLike', fooLikes[i].id);
                        todo.destroy().then(function (success) {
                            var result = {
                                code : 200,
                                message : '操作成功'
                            };
                            res.send(result);
                        }, function (error) {
                            var result = {
                                code : 400,
                                message : '操作失败'
                            };
                            res.send(result);
                        });

                        flag++;
                        break;
                    }

                }
                if (flag == 0) {

                    var result = {
                        code : 400,
                        message : '尚未评价'
                    };
                    res.send(result);



                }
            });

        });

    });
});

router.post('/foodlikelist', function(req, res, next) {
    var userName = req.body.username;


    var query = new AV.Query('UserInfo');
    query.get(userName).then(function (user) {

            var query = new AV.Query('FoodLike');

            query.equalTo("by", userName);


            query.include('ask');
            query.find().then(function (fooLikes) {

                var askDetail = new Array();

                for (var i = 0; i < fooLikes.length; i++) {
                    askDetail[i] = fooLikes[i].get('ask');
                }

                var result = {
                    code : 200,
                    data :fooLikes,
                   askDetail : askDetail,
                    message : '操作成功'
                }
                res.send(result);

            });

    });
});

module.exports = router;


