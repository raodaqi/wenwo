/**
 * Created by HanQi on 16/4/15.


消息状态
 * staus == 1   上架
 * staus == 2   审批中
 * staus == 5   审批失败
 * staus == 3   未上架
 * staus == 4   所有
 *
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var User = AV.Object.extend('UserInfo');
var Ask =  AV.Object.extend('AskMe');
var Tag =  AV.Object.extend('Tag');
var Like = AV.Object.extend('Like');


router.get('/allask', function(req, res, next) {
    //page      size
    var page = req.param('page') != null ? req.param('page') : 0;
    var size = req.param('size') != null ? req.param('size') : 10;
    var staus = req.param('staus') != null ? req.param('staus') : '1';
    //console.log(staus);
    var query = new AV.Query('AskMe');
    if(staus != '4') {
        query.equalTo('staus', staus);
    }
    query.limit(size);
    query.skip(page);
    query.find().then(function(results) {
        console.log(results);
        for (var i = 0; i < results.length; i++) {
            results[i].attributes.askContentHide = '****';
        }
        var result = {
            code : 200,
            data : results,
            message : 'Operation succeeded'
        }
        res.send(result);

    });

});

router.get('/askhide', function(req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');
    if (!userName) {
        var result = {
            code : 300,
            message : 'miss parameter : username'
        }
        res.send(result);
        return;
    }

    if (!askId) {
        var result = {
            code : 300,
            message : 'miss parameter : ask_id'
        }
        res.send(result);
        return;
    }
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
                    var query = new AV.Query('AskMe');
                    query.get(askId).then(function (post) {

                        var result = {
                            code : 200,
                            data : post,
                            message : 'operation successed'
                        }
                        res.send(result);
                        return;

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

        });
    });

});

router.get('/askdetail', function(req, res, next) {
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
                    var query = new AV.Query('AskMe');
                    query.get(askId).then(function (post) {

                        var result = {
                            code : 200,
                            data : post,
                            message : 'operation successed'
                        }
                        res.send(result);
                        return;

                    });
                    flag++;
                }
            }
            if (flag == 0) {
                var query = new AV.Query('AskMe');
                query.get(askId).then(function (post) {
                    post.attributes.askContentHide = '****';
                    var result = {
                        code : 200,
                        data : post,
                        message : 'operation successed'
                    }
                    res.send(result);
                    return;

                });

            }

        });
    });
});

router.get('/askedit', function(req, res, next) {

});

router.get('/like', function(req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');
    var type = req.param('type');

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        //console.log(ask);
        var relation = ask.relation('like');
        relation.query().find().then(function (list) {
            //console.log(list);
            var flag = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i].get('createBy') == userName) {
                    flag++;
                }
            }
            if (flag == 0) {
                var like = new Like();
                like.set('createBy', userName);
                like.set('type', type);
                like.save().then(function () {
                    relation.add(like);
                    ask.save();
                    var result = {
                        code : 200,
                        data : results,
                        message : 'Operation succeeded'
                    }
                    res.send(result);
                });
            }
            else  {
                var result = {
                    code : 700,
                    message : 'repetitive operation'
                }
                res.send(result);
            }
        });
    });

});

router.get('/getlike', function(req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        //console.log(ask);
        var relation = ask.relation('like');
        relation.query().find().then(function (list) {
            console.log(list);
            var result = {
                code : 200,
                data : list,
                message : 'operation succeeded'
            }
            res.send(result);
            return;
        });
    });

});

router.get('/myask', function(req, res, next) {
    var sessionToken = req.param('session_token');
    var userName = req.param('username');
    var staus = req.param('staus');
    if (!userName) {
        var result = {
            code : 300,
            message : 'miss parameter : username'
        }
        res.send(result);
        return;
    }
    //page      size
    var page = req.param('page') != null ? req.param('page') : 0;
    var size = req.param('size') != null ? req.param('size') : 10;
    var staus = req.param('staus') != null ? req.param('staus') : '1';
    /**
     * staus == 1   我上架的ask
     * staus == 2   我审批中ask
     * staus == 3   我未上架ask
     * staus == 4   我所有的ask
     * staus == 5   审批失败
     */
    var query = new AV.Query('AskMe');
    if(staus != '4') {
        query.equalTo('staus', staus);
    }
    query.equalTo('createBy', userName)
    query.limit(size);
    query.skip(page);
    query.find().then(function(results) {
        //console.log(results);
        var result = {
            code : 200,
            data : results,
            message : 'Operation succeeded'
        }
        res.send(result);

    });
});

router.get('/cancel', function(req, res, next) {
    //type  下架  取消审批
});

router.post('/sendask', function(req, res, next) {
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
    var type = req.param('type');
    if (!type) {
        var result = {
            code : 300,
            message : 'miss parameter : type'
        }
        res.send(result);
        return;
    }
    // var isfree = req.param('isfree');
    // if (!isfree) {
    //     var result = {
    //         code : 300,
    //         message : 'miss parameter : isfree'
    //     }
    //     res.send(result);
    //     return;
    // }
    var geoX = req.param('geo_x');
    //console.log(geoX);
    if (!geoX) {
        var result = {
            code : 300,
            message : 'miss parameter : geo_x'
        }
        res.send(result);
        return;
    }
    var geoY = req.param('geo_y');
    //console.log(geoX);
    if (!geoY) {
        var result = {
            code : 300,
            message : 'miss parameter : geo_y'
        }
        res.send(result);
        return;
    }
    var position = req.param('position');
    if (!position) {
        var result = {
            code : 300,
            message : 'miss parameter : position'
        }
        res.send(result);
        return;
    }
    var reason = req.param('reason');
    if (!reason) {
        var result = {
            code : 300,
            message : 'miss parameter : reason'
        }
        res.send(result);
        return;
    }
    var contentShow = req.param('content_show');
    if (!contentShow) {
        var result = {
            code : 300,
            message : 'miss parameter : content_show'
        }
        res.send(result);
        return;
    }
    var contentHide = req.param('content_hide');
    var price = req.param('price') != null ? req.param('price') : 0;
    var tag = req.param('tag');
    if (!tag) {
        var result = {
            code : 300,
            message : 'miss parameter : tag'
        }
        res.send(result);
        return;
    }
    var remark = req.param('remark');


    var ask = new Ask();
    ask.set('createBy', userName);
    ask.set('askType', type);
    if (price == '0') {
        ask.set('askIsFree', '1');
    }
    else {
        ask.set('askIsFree', '0');
    }
    //ask.set('askGeo', geo);
    ask.set('GeoX', geoX);
    ask.set('GeoY', geoY);
    ask.set('askPosition', position);
    ask.set('askReason', reason);
    ask.set('askContentShow', contentShow);
    ask.set('askContentHide', contentHide);
    ask.set('askPrice', price);
    ask.set('staus', '2');
    ask.set('askLevel', '1');
    ask.set('askDefault',remark);
    var relation = ask.relation('askTag');

    tag = JSON.parse(tag);

    setTag(tag, type, {
        success:function () {
            console.log('add');
            var query = new AV.Query('Tag');
            query.equalTo('tagOrderby', type);
            query.find().then(function(results) {
                console.log(results);
                var relation = ask.relation('askTag');
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i].get('tagName'));

                    if (tag.length == 1) {
                        var temp = (results[i].get('tagName') == tag[0].tag_name);

                    }
                    else if (tag.length == 2) {
                        var temp = (results[i].get('tagName') == tag[0].tag_name) || (results[i].get('tagName') == tag[1].tag_name);

                    }
                    else if (tag.length == 3) {
                        var temp = (results[i].get('tagName') == tag[0].tag_name) || (results[i].get('tagName') == tag[1].tag_name) || (results[i].get('tagName') == tag[2].tag_name);

                    }
                    console.log(temp);
                    if (temp) {
                        console.log(results[i]);
                        relation.add(results[i]);
                    }

                }
                ask.save().then(function(post) {
                    var result = {
                        code : 200,
                        message : 'Operation succeeded'
                    }
                    res.send(result);
                }, function(error) {
                    // 失败
                    console.log('Error: ' + error.code + ' ' + error.message);
                });

            });
        },
        error:function () {
            
        }
    });




});

router.post('/tag', function (req, res, next) {
    var tag = req.param('tag');
    var type = req.param('type');
    if (!type) {
        var result = {
            code : 300,
            message : 'miss parameter : type'
        }
        res.send(result);
        return;
    }
    if (!tag) {
        var result = {
            code : 300,
            message : 'miss parameter : tag'
        }
        res.send(result);
        return;
    }
    setTag(tag, type);
});

function setTag(tag, type, callback) {
    var tagName = new Array();
    // for (var i = 0; i < tag.length; i++) {
    //     tagName[i] = tag[i].tag_name;
    // }
    // for (var i = 0; i < tag.length; i++) {
    //     var query = new AV.Query('Tag');
    //     query.equalTo('tagOrderby', type);
    //     query.equalTo('tagName', tagName[i]);
    //     query.find().then(function(results) {
    //         console.log(i);
    //         if (results == '') {
    //             //console.log('没有');
    //             var tag = new Tag();
    //             tag.set('tagOrderby', type);
    //             tag.set('tagName', tagName[i]);
    //             tag.save().then(function(post) {
    //                 if(i == tag.length - 1) {
    //                     callback.success('success');
    //                 }
    //             });
    //
    //         }
    //         else {
    //             if (i == tag.length - 1) {
    //                 callback.success('success');
    //             }
    //         }
    //     });
    // }



    if (tag.length >= 1) {
        tagName[0] = tag[0].tag_name;
        //console.log(tagName);
        var query = new AV.Query('Tag');
        query.equalTo('tagOrderby', type);
        query.equalTo('tagName', tagName[0]);
        query.find().then(function(results) {
            if (results == '') {
                //console.log('没有');
                var tags = new Tag();
                tags.set('tagOrderby', type);
                tags.set('tagName', tagName[0]);
                tags.save().then(function(post) {
                    if(tag.length == 1){

                        callback.success('success');
                    }
                    else {
                        tagName[1] = tag[1].tag_name;
                        //console.log(tagName);
                        var query = new AV.Query('Tag');
                        query.equalTo('tagOrderby', type);
                        query.equalTo('tagName', tagName[1]);
                        query.find().then(function(results) {
                            //console.log(results);
                            if (results == '') {
                                //console.log('没有');
                                var tags = new Tag();
                                tags.set('tagOrderby', type);
                                tags.set('tagName', tagName[1]);
                                tags.save().then(function(post) {
                                    if (tag.length == 2) {
                                        callback.success('success');
                                    }
                                    else {
                                        tagName[2] = tag[2].tag_name;
                                        //console.log(tagName);
                                        var query = new AV.Query('Tag');
                                        query.equalTo('tagOrderby', type);
                                        query.equalTo('tagName', tagName[2]);
                                        query.find().then(function(results) {
                                            //console.log(results);
                                            if (results == '') {
                                                //console.log('没有');
                                                var tags = new Tag();
                                                tags.set('tagOrderby', type);
                                                tags.set('tagName', tagName[2]);
                                                tags.save().then(function(post) {
                                                    if (tag.length == 3) {
                                                        callback.success('success');
                                                    }

                                                });

                                            }
                                            else  {
                                                if (tag.length == 3) {
                                                    callback.success('success');
                                                }
                                            }

                                        });
                                    }
                                });

                            }
                            else {
                                if (tag.length == 2) {
                                    //console.log("123");
                                    callback.success('success');
                                }
                                else {
                                    tagName[2] = tag[2].tag_name;
                                    //console.log(tagName);
                                    var query = new AV.Query('Tag');
                                    query.equalTo('tagOrderby', type);
                                    query.equalTo('tagName', tagName[2]);
                                    query.find().then(function(results) {
                                        //console.log(results);
                                        if (results == '') {
                                            //console.log('没有');
                                            var tags = new Tag();
                                            tags.set('tagOrderby', type);
                                            tags.set('tagName', tagName[2]);
                                            tags.save().then(function(post) {
                                                if (tag.length == 3) {
                                                    callback.success('success');
                                                }

                                            });

                                        }
                                        else  {
                                            if (tag.length == 3) {
                                                callback.success('success');
                                            }
                                        }

                                    });
                                }
                            }
                        });
                    }
                });

            }
            else {
                //console.log(tag);
                if(tag.length == 1){
                    callback.success('success');
                }
                else {
                    tagName[1] = tag[1].tag_name;
                    //console.log(tagName);
                    var query = new AV.Query('Tag');
                    query.equalTo('tagOrderby', type);
                    query.equalTo('tagName', tagName[1]);
                    query.find().then(function(results) {
                        //console.log(results);
                        if (results == '') {
                            //console.log('没有');
                            var tags = new Tag();
                            tags.set('tagOrderby', type);
                            tags.set('tagName', tagName[1]);
                            tags.save().then(function(post) {
                                if (tag.length == 2) {
                                    callback.success('success');
                                }
                                else {
                                    tagName[2] = tag[2].tag_name;
                                    //console.log(tagName);
                                    var query = new AV.Query('Tag');
                                    query.equalTo('tagOrderby', type);
                                    query.equalTo('tagName', tagName[2]);
                                    query.find().then(function(results) {
                                        //console.log(results);
                                        if (results == '') {
                                            //console.log('没有');
                                            var tags = new Tag();
                                            tags.set('tagOrderby', type);
                                            tags.set('tagName', tagName[2]);
                                            tags.save().then(function(post) {
                                                if (tag.length == 3) {
                                                    callback.success('success');
                                                }

                                            });

                                        }
                                        else  {
                                            if (tag.length == 3) {
                                                callback.success('success');
                                            }
                                        }

                                    });
                                }
                            });

                        }
                        else {
                            if (tag.length == 2) {
                                //console.log("123");
                                callback.success('success');
                            }
                            else {
                                tagName[2] = tag[2].tag_name;
                                //console.log(tagName);
                                var query = new AV.Query('Tag');
                                query.equalTo('tagOrderby', type);
                                query.equalTo('tagName', tagName[2]);
                                query.find().then(function(results) {
                                    //console.log(results);
                                    if (results == '') {
                                        //console.log('没有');
                                        var tags = new Tag();
                                        tags.set('tagOrderby', type);
                                        tags.set('tagName', tagName[2]);
                                        tags.save().then(function(post) {
                                            if (tag.length == 3) {
                                                callback.success('success');
                                            }

                                        });

                                    }
                                    else  {
                                        if (tag.length == 3) {
                                            callback.success('success');
                                        }
                                    }

                                });
                            }
                        }
                    });
                }
            }

        });
    }

}



module.exports = router;
