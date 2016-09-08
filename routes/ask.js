/**
 * Created by HanQi on 16/4/15.

消息状态
 * staus == 1   上架
 * staus == 2   审批中
 * staus == 5   审批未通过
 * staus == 3   未上架
 * staus == 4   所有
 * staus == 6   删除
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var User = AV.Object.extend('UserInfo');
var Ask =  AV.Object.extend('AskMe');
var Tag =  AV.Object.extend('Tag');
var Like = AV.Object.extend('Like');
var Debase = AV.Object.extend('Debase');
var SearchLog = AV.Object.extend('SearchLog');


router.get('/allask', function(req, res, next) {
    //page      size
    var userName = req.query.username;
    var page = req.query.page != null ? req.query.page : 0;
    var size = req.query.size != null ? req.query.size : 1000;
    var staus = req.query.staus != null ? req.query.staus : '1';
    var type = req.query.type != null ? req.query.type : null;
    var geo = req.query.position_geo != null ? req.query.position_geo : null;
    var range = req.query.range != null ? req.query.range : null;

    //console.log(staus);
    var query = new AV.Query('AskMe');
    // query.include('askTag');
    // query.include('like');
    // var relation = query.relation('askTag');
    // query = relation.query();
    if(staus != '4') {
        query.equalTo('staus', staus);
    }

    if (type != null) {
        query.contains("askType", type);
    }
    
    if (size != null) {
        query.limit(size);
    }
    
    query.skip(page*size);
    if (geo == null || geo == '') {

        query.descending('createdAt');

    } else {

        var position = geo.split(",");

        var point = new AV.GeoPoint(parseFloat(position[0]),parseFloat(position[1]));
        // query.descending('score');
        query.withinKilometers('positionGeo', point, 3000.0);
    }

    if(range){
        query.withinKilometers('positionGeo', point, range/1000);
        query.descending("score");
    }
    query.include("vipCard");
    query.include("vipCard.image");
    query.include("vipCard.content");
    query.find().then(function(results) {
        // console.log(results.length);

        var query = new AV.Query('FoodLike');

        query.equalTo("by", userName);

        query.find().then(function (likeList) {

            for (var i = 0; i < results.length; i++) {
                // results[i].attributes.askContentHide = '****';
                var vipCard = results[i].get("vipCard");
                
                if(vipCard){
                    var vipCardImage = vipCard.get("image");
                    var vipCardContent = vipCard.get("content");
                }else{
                    var vipCardImage = '';
                    var vipCardContent = '';
                }
                results[i].attributes.vipCardImage = vipCardImage;
                results[i].attributes.vipCardContent = vipCardContent;

                if(results[i].attributes.askIsFree == "0" || results[i].attributes.askPrice !="0.00"){
                    // var length1 = results[i].get('askContentHide').length;
                    // var length2 = results[i].get('askContentHide').length;
                    // results[i].attributes.askContentHide = '';
                    // for (var j = 0; j < length; j++) {
                    //     results[i].attributes.askContentHide += '*';
                    // }
                    results[i].set('shopName', "请购买以后查看");
                    // results[i].set('askPosition', "请购买以后查看");
                }

                // var test = results[i].get('askTag');
                // console.log(test);
                // var relation = results[i].relation('askTag');
                // relation.query().find().then(function (list) {
                //     console.log(list);
                //
                // });

                var flag = 0;
                for ( var k = 0; k < likeList.length; k++) {

                    if (likeList[k].get('ask').id == results[i].id) {
                        flag ++;
                        results[i].set('liked', 1);

                        break;
                    }

                }
                if (flag == 0) {
                    results[i].set('liked', 0);
                }
            }

            var result = {
                code : 200,
                data : results,
                message : 'Operation succeeded'
            }

            res.send(result);
            return;

        });



    });

});

//美食搜索
/*
 *这里是搜索标签关键字
 */
router.get('/skeyword', function(req, res, next) {
    var keyword = req.query.keyword;
    console.log(keyword);

    var query = new AV.SearchQuery('Tag');
    query.queryString(keyword);
    query.limit(10);
    query.find().then(function (tag) {
        // results 返回的就是有图片的 Todo 集合
        var result = {
            code : 200,
            data : tag,
            message : "success"
        }
        res.send(result);
    }, function (error) {
        var result = {
            code : 400,
            message : "error"
        }
        res.send(result);
    });
})

//没事搜索
/*
 *这里是搜索标签和推荐理由
 */
router.get('/search', function(req, res, next) {
    var keyword = req.query.keyword;
    var userName = req.query.username;
    var page = req.query.page != null ? req.query.page : 0;
    var size = req.query.size != null ? req.query.size : 1000;
    var staus = req.query.staus != null ? req.query.staus : '1';

    if(!userName){
        var result = {
            code : 600,
            message : "缺少参数"
        }
        res.send(result);
        return;
    }
    if(!page || page == "0"){
       addsearchlog(keyword,userName); 
    }
    

    var query = new AV.Query('FoodLike');

    query.equalTo("by", userName);

    query.find().then(function (likeList) {

        var query = new AV.SearchQuery('AskMe');

        if (size != null) {
            // query.limit(parseInt(size));
        }
        
        // console.log(page*size);
        // query.sid(null);
        // query.skip(parseInt(page*size));

        //这里是进行多次设置查询值
        query.queryString(keyword+" AND staus:1");

        query.find().then(function (asklist) {
            // results 返回的就是有图片的 Todo 集合
            // console.log(asklist);
            var askDetail = new Array();
            var j = 0;
            // for (var i = 0; i < asklist.length; i++) {
            //     if(asklist[i].get("staus") == 1){
            //         askDetail[j] = asklist[i]; 
            //         for (var k = 0; k < likeList.length; k++) {
            //             if(likeList[k].get('ask').id == askDetail[j].id){
            //                 askDetail[j].set('liked', 1);
            //             }
            //         }
            //         j++;
            //     }   
            // }
            var length = parseInt(page*size) + parseInt(size);

            for (var i = page*size; i < length; i++) {
                if(!asklist[i]){
                    break;
                }

                if(asklist[i].get("staus") == 1){
                    askDetail[j] = asklist[i]; 
                    for (var k = 0; k < likeList.length; k++) {
                        if(likeList[k].get('ask').id == askDetail[j].id){
                            askDetail[j].set('liked', 1);
                        }
                    }
                    j++;
                }   
            }

            var result = {
                code : 200,
                data : askDetail,
                message : "success"
            }
            res.send(result);
        }, function (error) {
            var result = {
                code : 400,
                message : "error"
            }
            res.send(result);
        });
    }, function (error) {
        var result = {
            code : 400,
            message : "error"
        }
        res.send(result);
    });
})

/*
 *这里是搜索标签和推荐理由
 */
function ifexitSearchLog(data,callback){
    var query = new AV.Query('SearchLog');
    for(var key in data){
        query.equalTo(key, data[key]);
    }
    query.find().then(function (cardList) {
        callback.success(cardList);
    },function (error) {
        callback.error(error);
    });
}

function addsearchlog(keyword,username){
    var keyword = keyword;
    var createBy = username;
    var data = {
        createBy  : createBy,
        keyword   : keyword
    }
    ifexitSearchLog(data,{
        success:function(searchlog){
            if(!searchlog.length){
                var searchlog = new SearchLog();
                searchlog.set('createBy', createBy);
                searchlog.set('keyword', keyword);
                searchlog.set('times', 1);
                searchlog.save().then(function (searchlog) {
                }, function (error) {
                });
            }else{
                var searchlog = AV.Object.createWithoutData('SearchLog', searchlog[0].id);
                searchlog.increment('times', 1);
                searchlog.save().then(function (searchlog) {
                }, function (error) {
                });
            }
        }
    })
}

// 添加会员卡
router.post('/addvipcard', function(req, res, next) {
    var askid = req.body.askid;
    var vipcardid = req.body.vipcardid;
    if(!vipcardid || !askid){
        var result = {
            code : 600,
            message : "缺少参数"
        }
        res.send(result);
        return;
    }
    var query = new AV.Query('AskMe');

    query.get(askid).then(function (askme) {
        var vipCard = AV.Object.createWithoutData('VipCard', vipcardid);
        askme.set('vipCard', vipCard);
        askme.save().then(function (data) {
            res.send({code:200,  data:data, message:'操作成功'});
        },function(error){
            res.send({code:400,  message:'操作失败'});
            console.log(error);
        });
    });
})

router.get('/addsearchlog', function(req, res, next) {
    var keyword = req.query.keyword;
    var createBy = req.query.username;
    var data = {
        createBy  : createBy,
        keyword   : keyword
    }
    ifexitSearchLog(data,{
        success:function(searchlog){
            if(!searchlog.length){
                var searchlog = new SearchLog();
                searchlog.set('createBy', createBy);
                searchlog.set('keyword', keyword);
                searchlog.set('times', 1);
                searchlog.save().then(function (searchlog) {
                    // results 返回的就是有图片的 Todo 集合
                    var result = {
                        code : 200,
                        message : "success"
                    }
                    res.send(result);
                }, function (error) {
                    var result = {
                        code : 400,
                        message : "error"
                    }
                    res.send(result);
                });
            }else{
                var searchlog = AV.Object.createWithoutData('SearchLog', searchlog[0].id);
                searchlog.increment('times', 1);
                searchlog.save().then(function (searchlog) {
                    var result = {
                        code : 200,
                        message : "success"
                    }
                    res.send(result);
                }, function (error) {
                    var result = {
                        code : 400,
                        message : "error"
                    }
                    res.send(result);
                });
            }
        }
    }) 
})


router.get('/gettagask', function(req, res, next) {
    //page      size
    var userName = req.query.username;
    var page = req.query.page != null ? req.query.page : 0;
    var size = req.query.size != null ? req.query.size : 1000;
    var staus = req.query.staus != null ? req.query.staus : '1';
    var type = req.query.staus != null ? req.query.staus : '1';
    var tag = req.query.tag != null ? req.query.tag : null;
    var geo = req.query.position_geo != null ? req.query.position_geo : null;
    var range = req.query.range != null ? req.query.range : 3000000;

    var query = new AV.Query('AskMe');
    if(staus != '4') {
        query.equalTo('staus', staus);
    }

    if (type != null) {
        query.contains("askType", type);
    }
    if (size != null) {
        query.limit(size);
    }
    if (tag != null) {
        query.contains('askTagStr',tag);
    }
    
    query.skip(page*size);

    if (geo == null || geo == '') {

        query.descending("score");

    } else {

        var position = geo.split(",");
        var point = new AV.GeoPoint(parseFloat(position[0]),parseFloat(position[1]));
        query.withinKilometers('positionGeo', point, range/1000);
    }
    

    query.find().then(function(results) {
        // console.log(results.length);

        var query = new AV.Query('FoodLike');

        query.equalTo("by", userName);

        query.find().then(function (likeList) {


            for (var i = 0; i < results.length; i++) {
                // results[i].attributes.askContentHide = '****';
                if(results[i].attributes.askIsFree == "0" || results[i].attributes.askPrice !="0.00"){
                    // var length1 = results[i].get('askContentHide').length;
                    // var length2 = results[i].get('askContentHide').length;
                    // results[i].attributes.askContentHide = '';
                    // for (var j = 0; j < length; j++) {
                    //     results[i].attributes.askContentHide += '*';
                    // }

                    results[i].set('shopName', "请购买以后查看");
                    // results[i].set('askPosition', "请购买以后查看");
                }

                // var test = results[i].get('askTag');
                // console.log(test);
                // var relation = results[i].relation('askTag');
                // relation.query().find().then(function (list) {
                //     console.log(list);
                //
                // });

                var flag = 0;
                for ( var k = 0; k < likeList.length; k++) {

                    if (likeList[k].get('ask').id == results[i].id) {
                        flag ++;
                        results[i].set('liked', 1);

                        break;
                    }

                }
                if (flag == 0) {

                    results[i].set('liked', 0);


                }


            }

            var result = {
                code : 200,
                data : results,
                message : 'Operation succeeded'
            }

            res.send(result);
            return;

        });



    });

});

router.get('/sbask', function(req, res, next) {
    var query = new AV.Query('AskMe');
    query.descending('createdAt');
    query.find().then(function(results) {
        for(var i = 0; i < results.length; i++){
            var askResult = results[i];
            query.get(results[i].id).then(function (ask) {
                // console.log(ask);
                // 成功获得实例
                // data 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
                // if(ask.attributes.score != parseInt(ask.attributes.testScore)){
                //     ask.set("score",parseInt(ask.attributes.testScore));
                //     ask.save().then(function (todo) {
                //         console.log('objectId is ' + todo.id);
                //       }, function (error) {
                //         console.log(error);
                //       });
                // }
                
            }, function (error) {
                // 失败了
            });
        }
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
            // console.log(list);
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

router.post('/askdetail', function(req, res, next) {
    // 问我

    // var askId = req.param('ask_id');
    // console.log(askId);
    // var userName = req.param('username');
    // var query = new AV.Query('UserInfo');
    // query.equalTo('userName', userName);
    // query.find().then(function (resultes) {
    //     //console.log(resultes[0]);
    //     if (resultes != null && resultes !='') {
    //         var query = new AV.Query('AskMe');
    //         query.get(askId).then(function (ask) {
    //             var askCreate = ask.get('createBy');
    //             if (userName == askCreate) {
    //                 var result = {
    //                     code : 200,
    //                     nobuy : '1',
    //                     own: 1,
    //                     data : ask,
    //                     message : 'operation successed'
    //                 }
    //                 res.send(result);
    //                 return;
    //             }
    //         });
    //         var relation = resultes[0].relation('haved');
    //         if (relation == null || relation == '') {
    //             var query = new AV.Query('AskMe');
    //             query.get(askId).then(function (post) {
    //
    //                 console.log(post.attributes.askIsFree);
    //                 if((post.attributes.askIsFree == "0" && parseFloat(post.attributes.askPrice) != 0 )){
    //                     var length = post.get('askContentHide').length;
    //                     post.attributes.askContentHide = '';
    //                     for (var i = 0; i < length ; i++) {
    //                         post.attributes.askContentHide += '*';
    //                     }
    //                 }
    //
    //                 var result = {
    //                     code : 200,
    //                     nobuy : '1',
    //                     own: 0,
    //                     data : post,
    //                     message : 'operation successed'
    //                 }
    //                 res.send(result);
    //                 return;
    //
    //             });
    //         }
    //         relation.query().find().then(function (list) {
    //             console.log(list);
    //             var flag = 0;
    //             for (var i = 0; i < list.length; i++) {
    //                 //console.log(list[i].attributes.ask.id);
    //                 //console.log(askId);
    //                 if (list[i].attributes.ask.id == askId) {
    //                     var query = new AV.Query('AskMe');
    //                     //console.log('ask');
    //                     query.get(askId).then(function (post) {
    //                         //console.log('post');
    //                         var result = {
    //                             code : 200,
    //                             data : post,
    //                             own: 0,
    //                             nobuy : '0',
    //                             message : 'operation successed'
    //                         }
    //                         res.send(result);
    //                         return;
    //
    //                     });
    //                     flag++;
    //                 }
    //             }
    //             if (flag == 0) {
    //                 var query = new AV.Query('AskMe');
    //                 query.get(askId).then(function (post) {
    //                     // post.attributes.askContentHide = '****';
    //                     if(post.attributes.askIsFree == "0" || post.attributes.askPrice!="0.00"){
    //                         var length = post.get('askContentHide').length;
    //
    //                         post.attributes.askContentHide = '';
    //                         for (var i = 0; i < length; i++) {
    //                             post.attributes.askContentHide += '*';
    //                         }
    //
    //
    //                     }
    //                     var result = {
    //                         code : 200,
    //                         nobuy : '1',
    //                         own: 0,
    //                         data : post,
    //                         message : 'operation successed'
    //                     }
    //                     res.send(result);
    //                     return;
    //
    //                 });
    //
    //             }
    //
    //         });
    //     }
    //     else {
    //         var query = new AV.Query('AskMe');
    //         query.get(askId).then(function (post) {
    //             // post.attributes.askContentHide = '****';
    //              if(post.attributes.askIsFree == "0" || post.attributes.askPrice!="0.00"){
    //                  var length = post.get('askContentHide').length;
    //                  post.attributes.askContentHide = '';
    //                  for (var i = 0; i < length; i++) {
    //                      post.attributes.askContentHide += '*';
    //                  }
    //             }
    //             var result = {
    //                 code : 200,
    //                 nobuy : '1',
    //                 own: 0,
    //                 data : post,
    //                 message : 'operation successed'
    //             }
    //             res.send(result);
    //             return;
    //
    //         });
    //     }
    //
    // });

    // 问我 - 美食

    var userName = req.body.username;
    var askId = req.body.ask_id;

    var query = new AV.Query('UserInfo');
    query.include('wallet');
    query.get(userName).then(function (user) {

        if (!user || user == '') {

            res.send({code:500,message:'用户未信息错误'});
            return;

        } else  {


            var query = new AV.Query('AskMe');
            query.get(askId).then(function (ask) {

                var query = new AV.Query('Haved');

                var askPoint = AV.Object.createWithoutData('AskMe', askId);
                // console.log(askId);
                // query.equalTo("by", userName);
                query.equalTo("ask", askPoint);
                query.equalTo('type', '2');
                query.include('ask');
                query.find().then(function (havedList) {
                    // console.log(havedList);

                    var query = new AV.Query('FoodLike');

                    query.equalTo("by", userName);


                    query.include('ask');
                    query.find().then(function (foodLikeList) {

                        var havedFlag = 0;
                        var foodLikeFlag = 0;
                        var isOwnFlag = 0;
                        var havedNum = 0;
                        //var showDetail = 0;

                        // console.log(ask.id);
                        if (ask.get('createBy') == userName) {

                            isOwnFlag++;

                        }

                        if(havedList.length){
                            havedNum = havedList.length;
                        }

                        for (var i = 0; i < havedList.length; i++) {

                            // if (havedList[i].get('ask').id == askId) {

                            //     havedFlag++;

                            // }
                            if (havedList[i].get('by') == userName) {

                                havedFlag++;

                            }


                        }

                        for (var i = 0; i < foodLikeList.length; i++) {

                            if (foodLikeList[i].get('ask').id == askId) {

                                foodLikeFlag++;

                            }

                        }

                        if (isOwnFlag == 0 && havedFlag == 0) {

                            ask.set('shopName', "请购买以后查看");
                            ask.set('askPosition', "请购买以后查看");

                        }

                        detailShow = {
                            isOwnFlag:isOwnFlag,
                            foodLikeFlag:foodLikeFlag,
                            havedFlag:havedFlag,
                            havedNum :havedNum
                        };

                        res.send({code:200,data:ask,show:detailShow,message:'操作成功'});
                        return;


                    });


                });

            });



        }

    })

});

router.get('/getask', function(req, res, next) {
    var askId = req.param('ask_id');
    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        var length = ask.get('askContentHide').length;
        ask.attributes.askContentHide = '';
        for (var i = 0; length; i++) {
            ask.attributes.askContentHide += '*';
        }
        var result = {
            code : 200,
            data : ask,
            message : 'Operation succeeded'
        }
        res.send(result);
        return;
    });
});

router.post('/addLook', function(req, res, next) {
    var user = AV.User.current();
    var askId = req.body.ask_id;
    if(true){
        var query = new AV.Query('AskMe');
        query.get(askId).then(function (ask) {
            ask.increment('lookNum', 1);
            ask.save().then(function (data) {
              // 因为使用了 fetchWhenSave 选项，save 调用之后，如果成功的话，对象的计数器字段是当前系统最新值。
                var result = {
                    code : 200,
                    // data : data,
                    message : 'success'
                }
                res.send(result);
            }, function (error) {
              var result = {
                    code : 400,
                    message : 'error'
                }
                res.send(result);
            });
        });
    }else{
        var result = {
            code : 800,
            message : 'no user'
        }
        res.send(result);
    }  
});

router.get('/askadmin', function(req, res, next) {
    var askId = req.param('ask_id');
    var query = new AV.Query('AskMe');
    query.limit(1000);
    query.addAscending('updatedAt');
    query.get(askId).then(function (ask) {
        //ask.attributes.askContentHide = '****';
        var result = {
            code : 200,
            data : ask,
            message : 'Operation succeeded'
        }
        res.send(result);
        return;
    });
});

router.post('/admincancle', function (req, res, next) {
    var askId = req.param('ask_id');
    //var staus = req.param('staus');
    var userName = req.param('username');
    var cancleReason = req.body.cancle_reason;
    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        if ('wenwo' != userName) {
            var result = {
                code: 800,
                data: ask,
                message: 'illegal operation'
            };
            res.send(result);
            return;
        }
        else {
            ask.set('staus', '3');
            ask.set('askDefault', cancleReason);
            ask.save().then(function (ask) {
                var result = {
                    code: 200,
                    data: ask,
                    message: 'Operation succeeded'
                }
                res.send(result);
                return;
            }, function (err) {
                var result = {
                    code: 800,
                    data: err,
                    message: err.message
                }
                res.send(result);
                return;
                //console.log('Failed to create new object, with error message: ' + err.message);
            });
        }
    });
});

router.post('/askedit', function(req, res, next) {
    var askId = req.param('ask_id');
    var username = req.query.username;
    var type = req.param('type') != null ? req.param('type') : null ;
    var price = req.param('price') != null ? req.param('price') : null;
    var geoX = req.param('geo_x') != null ? req.param('geo_x') : null;
    var geoY = req.param('geo_y') != null ? req.param('geo_y') : null;
    var position = req.param('position') != null ? req.param('position') : null;
    var reason = req.param('reason') != null ? req.param('reason') : null;
    var contentShow = req.param('content_show') != null ? req.param('content_show') : null;
    var contentHide = req.param('content_hide') != null ? req.param('content_hide') : null;
    var tag = req.param('tag') != null ? req.param('tag') : null;
    var remark = req.param('remark') != null ? req.param('remark') : null;

    var images = req.param('images') != null ? req.param('images') : null;
    var shopName = req.param('shop_name') != null ? req.param('shop_name') : null;


    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        var askOwner = ask.get('createBy');
        if (askOwner == username) {
            var result = {
                code : 600,
                message : '未拥有该信息'
            }
            res.send(result);
            return;
        }
        if (type != null) {
            ask.set('askType', type);
        }
        if (price != null) {
            ask.set('askPrice', price);
            if (price == '0' || price == "0.00") {
                ask.set('askIsFree', '1');
            }
            else {
                ask.set('askIsFree', '0');
            }
        }
        if (geoX != null || geoY != null) {


            var point = null;

            if (geoX != null && geoY == null) {

                point = new AV.GeoPoint(parseFloat(geoX), parseFloat(ask.get('GeoY')));
                ask.set('GeoX', geoX);

            } else if (geoX == null && geoY != null) {

                point = new AV.GeoPoint(parseFloat(ask.get('GeoX')), parseFloat(geoY));
                ask.set('GeoY', geoY);

            } else {

                point = new AV.GeoPoint(parseFloat(geoX), parseFloat(geoY));
                ask.set('GeoX', geoX);
                ask.set('GeoY', geoY);

            }

            if (point != null) {

                ask.set('positionGeo', point);

            }

        }

        if (position != null) {
            ask.set('askPosition', position);
        }
        if (reason != null) {
            ask.set('askReason', reason);
        }
        if (contentShow != null) {
            ask.set('askContentShow', contentShow);
        }
        if (contentHide != null) {
            ask.set('askContentHide', contentHide);
        }
        if (remark != null) {
            ask.set('askDefault',remark);
        }
        if (tag != null) {
            ask.set('askTagStr', tag);
        }

        if (images != null) {

            ask.set('askImage', images);

        }
        if (shopName != null) {

            ask.set('shopName', shopName);

        }

        ask.set('staus', '1');
        ask.save().then(function (ask) {
            var result = {
                code : 200,
                data : ask,
                message : 'Operation succeeded'
            }
            res.send(result);
            return;
        }, function(err) {
            var result = {
                code : 800,
                message : err.message
            }
            res.send(result);
            //console.log('Failed to create new object, with error message: ' + err.message);
        });
    });

});

router.post('/askremove', function(req, res, next) {
    var askId = req.body.askid;
    var reason = req.body.reason;
    var user = AV.User.current();

    if(!user){
        var result = {
            code : 800,
            error:"No permissions"
        }
        res.send(result);
        return;
    }

    if(user.id != '5752bb7ad342d3006b3162b2'){
        var result = {
            code : 800,
            message:"No permissions"
        }
        res.send(result);
        return;
    }

    if(!reason){
        var result = {
            code : 600,
            message:"缺少下架理由"
        }
        res.send(result);
        return;
    }

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        ask.set('staus', '6');

        if (reason != null) {
            ask.set('askDefault', reason);
        }

        ask.save().then(function (ask) {
            var result = {
                code : 200,
                data : ask,
                message : 'Operation succeeded'
            }
            res.send(result);
            return;
        }, function(err) {
            var result = {
                code : 800,
                message : err.message
            }
            res.send(result);
        });
    });

});

router.post('/askadminedit', function(req, res, next) {
    var askId = req.body.askid;
    var tag = req.body.tag;
    var user = AV.User.current();
    if(!user){
        var result = {
            code : 800,
            error:"No permissions"
        }
        res.send(result);
        return;
    }

    if(user.id != '5752bb7ad342d3006b3162b2'){
        var result = {
            code : 800,
            message:"No permissions"
        }
        res.send(result);
        return;
    }

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        ask.set('askTagStr', tag);

        ask.save().then(function (ask) {
            var result = {
                code : 200,
                data : ask,
                message : 'Operation succeeded'
            }
            res.send(result);
            return;
        }, function(err) {
            var result = {
                code : 800,
                message : err.message
            }
            res.send(result);
        });
    });

});

router.post('/adminedit', function(req, res, next) {
    var askId = req.param('ask_id');
    var username = req.query.username;
    var type = req.param('type') != null ? req.param('type') : null ;
    var price = req.param('price') != null ? req.param('price') : null;
    var geoX = req.param('geo_x') != null ? req.param('geo_x') : null;
    var geoY = req.param('geo_y') != null ? req.param('geo_y') : null;
    var position = req.param('position') != null ? req.param('position') : null;
    var reason = req.param('reason') != null ? req.param('reason') : null;
    var contentShow = req.param('content_show') != null ? req.param('content_show') : null;
    var contentHide = req.param('content_hide') != null ? req.param('content_hide') : null;
    var tag = req.param('tag') != null ? req.param('tag') : null;
    var remark = req.param('remark') != null ? req.param('remark') : null;

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        //var askOwner = ask.get('createBy');
        if ('wenwo' == username) {
            var result = {
                code : 600,
                message : '未拥有该信息'
            }
            res.send(result);
            return;
        }
        if (type != null) {
            ask.set('askType', type);
        }
        if (price != null) {
            ask.set('askPrice', price);
            if (price == '0' || price == "0.00") {
                ask.set('askIsFree', '1');
            }
            else {
                ask.set('askIsFree', '0');
            }
        }
        if (geoX != null) {
            ask.set('GeoX', geoX);
        }
        if (geoY != null) {
            ask.set('GeoY', geoY);
        }
        if (position != null) {
            ask.set('askPosition', position);
        }
        if (reason != null) {
            ask.set('askReason', reason);
        }
        if (contentShow != null) {
            ask.set('askContentShow', contentShow);
        }
        if (contentHide != null) {
            ask.set('askContentHide', contentHide);
        }
        if (remark != null) {
            ask.set('askDefault',remark);
        }
        if (tag != null) {
            ask.set('askTagStr', tag);
        }

        ask.set('staus', '2');
        ask.save().then(function (ask) {
            var result = {
                code : 200,
                data : ask,
                message : 'Operation succeeded'
            }
            res.send(result);
            return;
        }, function(err) {
            var result = {
                code : 800,
                message : err.message
            }
            res.send(result);
            return;
            //console.log('Failed to create new object, with error message: ' + err.message);
        });
    });

});

router.get('/like', function(req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');
    var type = req.param('type');   //type == 1  赞    ==2踩

    var userQuery = new AV.Query('UserInfo');
    userQuery.get(userName).then(function (user) {
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
                        var listType = list[i].get('type');
                        if (type == listType) {
                            var result = {
                                code : 700,
                                message : 'repetitive operation'
                            }
                            res.send(result);
                            return;
                        }
                        else {
                            list[i].set('type', type);
                            list[i].save().then(function (lk) {
                                if (type == 1 || type == '1') {
                                    ask.set('likeNum', (parseInt(ask.get('likeNum'))+2).toString());
                                    ask.set('score', ask.get('score') + 1);
                                }
                                else {
                                    ask.set('likeNum', (parseInt(ask.get('likeNum'))-2).toString());
                                    ask.set('score', ask.get('score') - 5);
                                }
                                ask.save().then(function (ask) {
                                    // var relation = ask.relation('like');
                                    // relation.query().find().then(function (list) {
                                        // var likeNum = 0;
                                        // var disLikeNum = 0;
                                        // for (var i = 0; i < list.length; i++) {
                                        //     if (list[i].get('type') == 1 || list[i].get('type') == '1') {
                                        //         likeNum++;
                                        //     }
                                        //     else {
                                        //         disLikeNum++;
                                        //     }
                                        // }
                                        // var data = {
                                        //     likeNum:likeNum,
                                        //     disLikeNum:disLikeNum
                                        // };
                                        var result = {
                                            code : 200,
                                            data:ask,
                                            message : '操作成功'
                                        };
                                        res.send(result);
                                        return;
                                    //});

                                });
                            });
                        }

                    }
                }
                if (flag == 0) {
                    var like = new Like();
                    like.set('createBy', userName);
                    like.set('type', type);
                    like.save().then(function () {
                        relation.add(like);
                        if(type == 1) {
                            ask.set('likeNum', (parseInt(ask.get('likeNum'))+1).toString());
                            ask.set('score', ask.get('score') + 1);
                        }
                        else {
                            ask.set('likeNum', (parseInt(ask.get('likeNum'))-1).toString());
                            ask.set('score', ask.get('score') - 5);
                        }
                        ask.save().then(function (ask) {
                            var num = parseInt(ask.get('likeNum'));
                            var query = new AV.Query('Level');
                            query.addDescending('score');
                            query.find().then(function (levels) {
                                for(var i = 0; i < levels.length; i++) {
                                    if(parseInt(ask.get('askLevel')) < levels[i].get('score')) {
                                        ask.set('askLevel', (levels.length - i - 1).toString());
                                    }
                                }
                                ask.save().then(function (ask) {
                                    // var relation = ask.relation('like');
                                    // relation.query().find().then(function (list) {
                                    //     var likeNum = 0;
                                    //     var disLikeNum = 0;
                                    //     for (var i = 0; i < list.length; i++) {
                                    //         if (list[i].get('type') == 1 || list[i].get('type') == '1') {
                                    //             likeNum++;
                                    //         }
                                    //         else {
                                    //             disLikeNum++;
                                    //         }
                                    //     }
                                    //     var data = {
                                    //         likeNum:likeNum,
                                    //         disLikeNum:disLikeNum
                                    //     };
                                        var result = {
                                            code : 200,
                                            data:ask,
                                            message : '操作成功'
                                        }
                                        res.send(result);
                                        return;
                                    // });
                                });

                            });

                        });

                    });
                }
                // else  {
                //     var result = {
                //         code : 700,
                //         message : 'repetitive operation'
                //     }
                //     res.send(result);
                // }
            });
        });
    });


});

router.get('/isliked', function (req, res, next) {
    var askId = req.query.ask_id;
    var username = req.query.username;
    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        var relation = ask.relation('like');
        relation.query().find().then(function (list) {
            var flag = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i].get('createBy') == username) {
                    flag = list[i].get('type');
                }
            }
            if (flag == 0) {
                var result = {
                    code : 200,
                    isliked : 0,
                    message : 'operation succeeded'
                }
                res.send(result);
                return;
            }
            else if (flag == 1) {
                var result = {
                    code : 200,
                    isliked : 1,
                    message : 'operation succeeded'
                }
                res.send(result);
                return;
            }
            else {
                var result = {
                    code : 200,
                    isliked : 2,
                    message : 'operation succeeded'
                }
                res.send(result);
                return;
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
            // console.log(list);
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

// function getBuyNum(askId,callback){
//   // var askMe = AV.Object.createWithoutData('AskMe', objectId);
//   // var relation = askMe.relation('haved');
//   var query = new AV.Query('Haved');
//   var askPoint = AV.Object.createWithoutData('AskMe', askId);
//   query.equalTo("ask", askPoint);
//   query.find().then(function (results) {
//   // results 是一个 AV.Object 的数组
//   // results 指的就是所有包含当前 tag 的 TodoFolder
//     console.log(results.length);
//     callback.success(results);
//   }, function (error) {
//     // console.log(error);
//     callback.error(error);
//   });
// }
function getBuyNum(ask,show,i,callback){
  var askId =  ask[i].id;
  var askLength = ask.length;
  var query = new AV.Query('Haved');
  var askPoint = AV.Object.createWithoutData('AskMe', askId);
  query.equalTo("ask", askPoint);
  query.find().then(function (results) {
  // results 是一个 AV.Object 的数组
  // results 指的就是所有包含当前 tag 的 TodoFolder
    // console.log(results.length);
    var data = {
        askId : askId,
        buyNum : results.length
    }
    // show[askId] = results.length;
    show[i] = data;
    i++;
    if(i < askLength){
        getBuyNum(ask,show,i,callback);
    }else{
        callback.success(show);
    }
  }, function (error) {
    // console.log(error);
    callback.error(error);
  });
}

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
    query.equalTo('createBy', userName);
    query.descending('createdAt');
    query.limit(size);
    query.skip(page);

    query.find().then(function(ask) {
        // console.log(ask);
        var query = new AV.Query('FoodLike');
        query.equalTo("by", userName);
        query.find().then(function (likeList) {

            var show = {};
            var i = 0;

            for (var j = 0; j < ask.length; j++) {
                for (var k = 0; k < likeList.length; k++) {
                    if(likeList[k].get('ask').id == ask[j].id){
                        ask[j].set('liked', 1);
                    }
                }
            }

            getBuyNum(ask,show,i,{
                success:function(buyNum){
                    // console.log(result);
                    var result = {
                        code : 200,
                        data : ask,
                        buyNum : buyNum,
                        message : 'Operation succeeded'
                    }
                    res.send(result);
                },
                error:function(error){
                    console.log(error);
                    var result = {
                        code : 200,
                        data : ask,
                        message : 'Operation succeeded'
                    }
                    res.send(result);
                }
            })
        },function(){
            
        })

        // for(var i = 0; i < results.length;i++){
        //     console.log(results[i].id);
        //     getBuyNum(results[i].id,{
        //         success:function(result){
        //             console.log(result.length);
        //         },
        //         error:function(error){
        //             console.log(error);
        //         }
        //     })
        // }

        // var result = {
        //     code : 200,
        //     data : results,
        //     message : 'Operation succeeded'
        // }
        // res.send(result);

    });
});

router.get('/cancel', function(req, res, next) {
    //type  下架  取消审批
    var askId = req.param('ask_id');
    //var staus = req.param('staus');
    var userName = req.param('username');
    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        if (ask.get('createBy') != userName) {
            var result = {
                code: 800,
                data: ask,
                message: 'illegal operation'
            }
            res.send(result);
            return;
        }
        else {
            ask.set('staus', '3');
            ask.save().then(function (ask) {
                var result = {
                    code: 200,
                    data: ask,
                    message: 'Operation succeeded'
                }
                res.send(result);
                return;
            }, function (err) {
                var result = {
                    code: 800,
                    data: err,
                    message: err.message
                }
                res.send(result);
                return;
                //console.log('Failed to create new object, with error message: ' + err.message);
            });
        }
    });
});

router.get('/up', function(req, res, next) {

    var askId = req.param('ask_id');
    //var staus = req.param('staus');
    var userName = req.param('username');
    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        if (ask.get('creatBy') != userName) {
            var result = {
                code: 800,
                data: ask,
                message: 'illegal operation'
            }
            res.send(result);
            return;
        }
        else {
            ask.set('staus', 2);
            ask.save().then(function (ask) {
                var result = {
                    code: 200,
                    data: ask,
                    message: 'Operation succeeded'
                }
                res.send(result);
                return;
            }, function (err) {
                var result = {
                    code: 800,
                    data: err,
                    message: err.message
                }
                res.send(result);
                return;
                //console.log('Failed to create new object, with error message: ' + err.message);
            });
        }
    });
});

router.post('/del', function(req, res, next) {

    var reason = req.body.reason;
    var askId = req.body.ask_id;
    var userName = req.body.username;

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        // console.log(ask.get('createBy'));
        if (ask.get('staus') == "6") {
            var result = {
                code: 700,
                message: 'Repeat delete'
            }
            res.send(result);
            return;
        }
        if (ask.get('createBy') != userName) {
            var result = {
                code: 800,

                message: 'illegal operation'
            }
            res.send(result);
            return;
        }
        else {
            ask.set('staus', "6");
            ask.set('askDefault', reason);
            ask.save().then(function (results) {
                // console.log(results);
                var result = {
                    code: 200,
                    data: results,
                    message: 'Operation succeeded'
                }
                res.send(result);
                return;
            }, function (err) {
                // console.log(err);
                var result = {
                    code: 400,
                    data: '',
                    message: err.message
                }
                res.send(result);
                return;
                //console.log('Failed to create new object, with error message: ' + err.message);
            });
        }
    });
});

router.post('/approval', function(req, res, next) {
    var askId = req.body.ask_id;
    var staus = req.body.staus;
    var reason = req.body.reason;
    var query = new AV.Query('AskMe');

    query.get(askId).then(function (ask) {
        ask.set('staus', staus);
        ask.set('askDefault', reason);
        ask.save().then(function () {
            var result = {
                code : 200,
                message : 'Operation succeeded'
            }
            res.send(result);
            return;
        });
    });
});

router.post('/sendask', function(req, res, next) {
    var sessionToken = req.param('session_token');

    var images = req.param('images');
    var shopName = req.param('shop_name');

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
    price = price.replace(/\s+/g,"");

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

    var query = new AV.Query('UserInfo');
    query.equalTo('userName', userName);
    query.find().then(function (user) {
        //console.l
        user = user[0];
        var ask = new Ask();
        ask.set('createBy', userName);
        ask.set('askType', type);
        if (price == '0' || price == '0.00') {
            ask.set('askIsFree', '1');
        }
        else {
            ask.set('askIsFree', '0');
        }
        //ask.set('askGeo', geo);
        ask.set('askImage', images);
        ask.set('shopName', shopName);
        ask.set('GeoX', geoX);
        ask.set('GeoY', geoY);
        ask.set('askPosition', position);
        ask.set('askReason', reason);
        ask.set('askContentShow', contentShow);
        ask.set('askContentHide', contentHide);
        ask.set('askPrice', price);
        ask.set('staus', '1');
        ask.set('createByName', user.get('uName'));
        ask.set('createByUrl', user.get('userHead'));
        ask.set('askImage', images);
        ask.set('shopName', shopName);

        var point = new AV.GeoPoint(parseFloat(geoX), parseFloat(geoY));
        ask.set('positionGeo', point);


        //ask.set('askLevel', '1');
        ask.set('askDefault',remark);
        ask.set('askTagStr', tag);
        var relation = ask.relation('askTag');

        tag = JSON.parse(tag);

        setTag(tag, type, {
            success:function () {
                // console.log('add');
                var query = new AV.Query('Tag');
                query.equalTo('tagOrderby', type);
                query.find().then(function(results) {
                    // console.log(results);
                    var relation = ask.relation('askTag');
                    for (var i = 0; i < results.length; i++) {
                        // console.log(results[i].get('tagName'));

                        if (tag.length == 1) {
                            var temp = (results[i].get('tagName') == tag[0].tag_name);

                        }
                        else if (tag.length == 2) {
                            var temp = (results[i].get('tagName') == tag[0].tag_name) || (results[i].get('tagName') == tag[1].tag_name);

                        }
                        else if (tag.length == 3) {
                            var temp = (results[i].get('tagName') == tag[0].tag_name) || (results[i].get('tagName') == tag[1].tag_name) || (results[i].get('tagName') == tag[2].tag_name);

                        }
                        // console.log(temp);
                        if (temp) {
                            // console.log(results[i]);
                            relation.add(results[i]);
                        }

                    }
                    ask.save().then(function(ask) {
                        var result = {
                            code : 200,
                            data : ask,
                            message : 'Operation succeeded'
                        }
                        res.send(result);
                        return;
                    }, function(error) {
                        // 失败
                        // console.log('Error: ' + error.code + ' ' + error.message);
                    });

                });
            },
            error:function () {

            }
        });

    });





});

router.get('/tagshow', function (req, res, next) {
    var type = req.query.type;
    var tag = req.query.tag;
    tag = JSON.parse(tag);
    // console.log(tag);
    //tag = tag.split(',');
    for (var i = 0; i < tag.length; i++) {
        tag[i] = tag[i].tag_name;
    }
    // console.log(tag);
    // if (tag.length == 1) {
    //     var query = new AV.Query('Tag');
    //     query.equalTo('tagName', tag[0]);
    //     query.contains('type', type);
    //     query.find().then(function (tags) {
    //         if (tags == '') {
    //             var result = {
    //                 code : 404,
    //                 url : 0,
    //                 message : '没有该标签'
    //             }
    //             res.send(result);
    //             return;
    //         }
    //         else {
    //             if (tags[0].get('tagUrl') == null) {
    //                 var result = {
    //                     code : 400,
    //                     url : 0,
    //                     message : '无效url'
    //                 }
    //                 res.send(result);
    //                 return;
    //             }
    //             else {
    //                 var result = {
    //                     code : 200,
    //                     url : tags[0].get('tagUrl'),
    //                     message : '操作成功'
    //                 }
    //                 res.send(result);
    //                 return;
    //             }
    //
    //             res.send(result);
    //             return;
    //         }
    //     });
    // }
    // else if (tag.length == 2) {
    //     var queryL1 = new AV.Query('Tag');
    //     var queryL2 = new AV.Query('Tag');
    //     queryL1.equalTo('tagName', tag[0]);
    //     queryL2.equalTo('tagName', tag[1]);
    //     var mainQuery = AV.Query.or(queryL1, queryL2);
    //     mainQuery.contains('type', type);
    //     mainQuery.find().then(function (tags) {
    //         console.log(tags);
    //         if (tags == '') {
    //             var result = {
    //                 code : 404,
    //                 url : 0,
    //                 message : '没有该标签'
    //             }
    //             res.send(result);
    //             return;
    //         }
    //         else {
    //             if (tags[0].get('tagUrl') == null ) {
    //                 if (tags[1] == null || tags[1].get('tagUrl')) {
    //                     var result = {
    //                         code : 400,
    //                         url : 0,
    //                         message : '无效url'
    //                     }
    //                     res.send(result);
    //                     return;
    //                 }
    //                 else {
    //                     var result = {
    //                         code : 200,
    //                         url : tags[1].get('tagUrl'),
    //                         message : '操作成功'
    //                     }
    //                     res.send(result);
    //                     return;
    //                 }
    //
    //             }
    //             else {
    //                 var result = {
    //                     code : 200,
    //                     url : tags[0].get('tagUrl'),
    //                     message : '操作成功'
    //                 }
    //             }
    //
    //             res.send(result);
    //             return;
    //         }
    //     });
    //
    // }
    // else if (tag.length == 3) {
    //     var queryL1 = new AV.Query('Tag');
    //     var queryL2 = new AV.Query('Tag');
    //     var queryL3 = new AV.Query('Tag');
    //     queryL1.equalTo('tagName', tag[0]);
    //     queryL2.equalTo('tagName', tag[1]);
    //     queryL3.equalTo('tagName', tag[2]);
    //     var fQuery = AV.Query.or(queryL1, queryL2);
    //     var mainQuery = AV.Query.or(fQuery, queryL3);
    //     //mainQuery.contains('type', type);
    //     mainQuery.find().then(function (tags) {
    //         console.log(tags);
    //         if (tags == '') {
    //             var result = {
    //                 code : 404,
    //                 url : 0,
    //                 message : '没有该标签'
    //             }
    //             res.send(result);
    //             return;
    //         }
    //         else {
    //             if (tags[0].get('tagUrl') == null) {
    //                 if (tags[1] == null || tags[1].get('tagUrl') == null) {
    //                     if (tags[2] == null || tags[1].get('tagUrl') == null) {
    //                         var result = {
    //                             code : 400,
    //                             url : 0,
    //                             message : '无效url'
    //                         }
    //                         res.send(result);
    //                         return;
    //                     }
    //                     else {
    //                         var result = {
    //                             code : 200,
    //                             url : tags[2].get('tagUrl'),
    //                             message : '操作成功'
    //                         }
    //                         res.send(result);
    //                         return;
    //                     }
    //
    //                 }
    //                 else {
    //                     var result = {
    //                         code : 200,
    //                         url : tags[1].get('tagUrl'),
    //                         message : '操作成功'
    //                     }
    //                     res.send(result);
    //                     return;
    //                 }
    //
    //             }
    //             else {
    //                 var result = {
    //                     code : 200,
    //                     url : tags[0].get('tagUrl'),
    //                     message : '操作成功'
    //                 }
    //             }
    //
    //             res.send(result);
    //             return;
    //         }
    //     });
    //
    // }
    findUrl(type, tag, 0, res);

    // var query = new AV.Query('Tag');
    // query.equalTo('tagName', tag[0]);
    // query.find().then(function (resultes) {
    //     if (resultes == null || resultes == '' ) {
    //         if (tag[1] != null) {
    //             var query = new AV.Query('Tag');
    //             query.equalTo('tagName', tag[1]);
    //             query.find().then(function (resultes) {
    //                 if (resultes == null || resultes == '' ) {
    //                     if (tag[2] != null) {
    //                         var query = new AV.Query('Tag');
    //                         query.equalTo('tagName', tag[2]);
    //                         query.find().then(function (resultes) {
    //                             if (resultes == null || resultes == '' ) {
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //                             }
    //                             else {
    //                                 for (var i = 0; i < resultes.length; i++) {
    //
    //                                     if ((type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) && resultes[i].get('tagUrl') != '') {
    //                                         var result = {
    //                                             code : 200,
    //                                             url : resultes[i],
    //                                             message : '操作成功'
    //                                         }
    //                                         res.send(result);
    //                                     }
    //
    //                                 }
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //
    //                             }
    //
    //                         });
    //                     }
    //                     else {
    //                         var result = {
    //                             code : 400,
    //                             url : 0,
    //                             message : '没有url'
    //                         };
    //                         res.send(result);
    //                         return;
    //                     }
    //                 }
    //                 else {
    //
    //                     for (var i = 0; i < resultes.length; i++) {
    //                         console.log(resultes[i]);
    //                         if ((type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) && resultes[i].get('tagUrl') != '') {
    //                             var result = {
    //                                 code : 200,
    //                                 url : resultes[i],
    //                                 message : '操作成功'
    //                             }
    //                             res.send(result);
    //                             return;
    //                         }
    //                     }
    //                     if (tag[2] != null) {
    //                         var query = new AV.Query('Tag');
    //                         query.equalTo('tagName', tag[2]);
    //                         query.find().then(function (resultes) {
    //                             if (resultes == null || resultes == '') {
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //                             }
    //                             else {
    //                                 for (var i = 0; i < resultes.length; i++) {
    //
    //                                     if ((type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) && resultes[i].get('tagUrl') != '') {
    //                                         var result = {
    //                                             code : 200,
    //                                             url : resultes[i],
    //                                             message : '操作成功'
    //                                         }
    //                                         res.send(result);
    //                                         return;
    //                                     }
    //
    //                                 }
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //
    //                             }
    //
    //                         });
    //                     }
    //                     else {
    //                         var result = {
    //                             code : 400,
    //                             url : 0,
    //                             message : '没有url'
    //                         };
    //                         res.send(result);
    //                         return;
    //                     }
    //                 }
    //             });
    //         }
    //         else {
    //
    //             var result = {
    //                 code : 400,
    //                 url : 0,
    //                 message : '没有url'
    //             };
    //             res.send(result);
    //             return;
    //         }
    //     }
    //     else {
    //         for (var i = 0; i < resultes.length; i++) {
    //             console.log(resultes[i]);
    //             if ((type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) && resultes[i].get('tagUrl') != '') {
    //                 var result = {
    //                     code : 200,
    //                     url : resultes[i],
    //                     message : '操作成功'
    //                 }
    //                 res.send(result);
    //                 return;
    //             }
    //         }
    //         if (tag[1] != null) {
    //             var query = new AV.Query('Tag');
    //             query.equalTo('tagName', tag[1]);
    //             query.find().then(function (resultes) {
    //                 if (resultes == null || resultes == '' ) {
    //                     if (tag[2] != null) {
    //                         var query = new AV.Query('Tag');
    //                         query.equalTo('tagName', tag[2]);
    //                         query.find().then(function (resultes) {
    //                             if (resultes == null || resultes == '' ) {
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //                             }
    //                             else {
    //                                 for (var i = 0; i < resultes.length; i++) {
    //                                     if (type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) {
    //                                         var result = {
    //                                             code : 200,
    //                                             url : resultes[i],
    //                                             message : '操作成功'
    //                                         }
    //                                         res.send(result);
    //                                         return;
    //                                     }
    //
    //                                 }
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //                             }
    //
    //                         });
    //                     }
    //                     else {
    //                         var result = {
    //                             code : 400,
    //                             url : 0,
    //                             message : '没有url'
    //                         };
    //                         res.send(result);
    //                         return;
    //                     }
    //                 }
    //                 else {
    //                     for (var i = 0; i < resultes.length; i++) {
    //                         if (type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) {
    //                             var result = {
    //                                 code : 200,
    //                                 url : resultes[i],
    //                                 message : '操作成功'
    //                             }
    //                             res.send(result);
    //                             return;
    //                         }
    //                     }
    //                     if (tag[2] != null) {
    //                         var query = new AV.Query('Tag');
    //                         query.equalTo('tagName', tag[2]);
    //                         query.find().then(function (resultes) {
    //                             if (resultes == null || resultes == '' ) {
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //                             }
    //                             else {
    //                                 for (var i = 0; i < resultes.length; i++) {
    //                                     if (type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) {
    //                                         var result = {
    //                                             code : 200,
    //                                             url : resultes[i],
    //                                             message : '操作成功'
    //                                         }
    //                                         res.send(result);
    //                                         return;
    //                                     }
    //
    //                                 }
    //                                 var result = {
    //                                     code : 400,
    //                                     url : 0,
    //                                     message : '没有url'
    //                                 };
    //                                 res.send(result);
    //                                 return;
    //
    //                             }
    //
    //                         });
    //                     }
    //                     else {
    //                         var result = {
    //                             code : 400,
    //                             url : 0,
    //                             message : '没有url'
    //                         };
    //                         res.send(result);
    //                         return;
    //                     }
    //                 }
    //             });
    //         }
    //         else {
    //             var result = {
    //                 code : 400,
    //                 url : 0,
    //                 message : '没有url'
    //             };
    //             res.send(result);
    //             return;
    //         }
    //     }
    // });
});

router.get('/gettag', function (req, res, next) {
    var type = req.param('type') != null ? req.param('type') : null;
    var size = req.param('size') != null ? req.param('size') : null;

    var query = new AV.Query('Tag');
    var que = new AV.Query('Tag');
    if (type != null) {
        if (type.length > 1) {
            var temp = type.split(',');
            query.contains("tagOrderby", temp[0]);
            que.contains("tagOrderby", temp[1]);
        }
    }
    var mainquery = AV.Query.or(query, que);
    if (type != null) {
        if (type.length == 1) {
            mainquery.contains("tagOrderby", type);
        }
    }
    if (size != null) {
        mainquery.limit(size);
    }
    mainquery.addDescending('times');


    mainquery.find().then(function (list) {
        // console.log(list);
        var result = {
            code : 200,
            data : list,
            message : 'Operation succeeded'
        }
        res.send(result);
    });
});

function ifTagExit(data,tag){
    for(var i in data){
        if(data[i].attributes.tagName == tag){
            return 0;
        }    
    }
    return 1;
}

router.get('/getalltag', function (req, res, next) {
    var size = req.param('size') != null ? req.param('size') : null;

    var mainquery = new AV.Query('Tag');
    if (size != null) {
        mainquery.limit(size);
    }
    mainquery.addDescending('times');

    mainquery.find().then(function (list) {
        // console.log(list);
        var hot      = [],
            hotPot   = [],
            barbecue = [],
            Noodle   = [],
            cc       = [],
            other    = [],
            cai      = [];

        var k = 0;
        for(var i = 0 ; i < list.length; i ++){
            var code = 0;

            if(list[i].attributes.tagName.indexOf("火锅") >= 0){
                if(ifTagExit(hotPot,list[i].attributes.tagName)){
                    hotPot.push(list[i]);
                }    
                code = 1;
            }

            if(list[i].attributes.tagName.indexOf("菜") >= 0){
                if(ifTagExit(cai,list[i].attributes.tagName)){
                    cai.push(list[i]);
                }
                code = 1;
            }

            if(list[i].attributes.tagName.indexOf("串串") >= 0){
                if(ifTagExit(cc,list[i].attributes.tagName)){
                    cc.push(list[i]);
                }
                code = 1;
            }

            if(list[i].attributes.tagName.indexOf("烧烤") >= 0){
                if(ifTagExit(barbecue,list[i].attributes.tagName)){
                    barbecue.push(list[i]);
                }
                code = 1;
            }

            if(list[i].attributes.tagName.indexOf("面") >= 0 && list[i].attributes.tagName.indexOf("面包") < 0){
                if(ifTagExit(Noodle,list[i].attributes.tagName)){
                    Noodle.push(list[i]);
                }
                code = 1;
            }

            if(k < 10){
                if(ifTagExit(hot,list[i].attributes.tagName)){
                    hot.push(list[i]);
                    k++;
                }
                code = 1;
            }

            if(!code){
                other.push(list[i]);
            }
        }
        var type = {
            "热门" : hot,
            "火锅" : hotPot,
            "烧烤" : barbecue,
            "面食" : Noodle,
            "串串" : cc,
            "菜类" : cai,
            "其他" : other
        }

        var result = {
            code : 200,
            // data : list,
            type : type,
            message : 'Operation succeeded'
        }
        res.send(result);
    },function (error) {
        var result = {
            code : 400,
            message : 'error'
        }
        res.send(result);
    });
});

router.get('/getbuy', function (req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        //console.log(ask);
        var relation = ask.relation('haved');
        relation.query().find().then(function (list) {
            // console.log(list);
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

router.get('/getrefund', function (req, res, next) {
    var askId = req.param('ask_id');
    var userName = req.param('username');

    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        //console.log(ask);
        var relation = ask.relation('refundInfo');
        relation.query().find().then(function (list) {
            // console.log(list);
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

router.post('/addtag', function (req, res, next) {
    var type = req.query.type;
    var url = req.query.url;
    var tagname = req.query.tag_name;

    var query = new AV.Query('Tag');
    query.equalTo('tagName', tagname);
    query.equalTo('tagOrderby', type);
    query.find().then(function (resultes) {
        if (resultes == '' || resultes == null) {
            var tag = new Tag();
            tag.set('tagOrderby', type);
            tag.set('tagName', tagname);
            tag.set('tagUrl', url);
            tag.save().then(function (tag) {
                var result = {
                    code : 200,
                    data : tag,
                    message : 'operation succeeded'
                }
                res.send(result);
            });
        }
        else {
            var result = {
                code : 600,
                message : '该标签已存在'
            }
            res.send(result);
        }
    });


});

router.post('/edittag', function (req, res, next) {
    var type = req.param('type');
    var level = req.param('level');
    var name = req.param('tag_name');
    var url = req.param('url');

    var query = new AV.Query('Tag');
    query.equalTo('tagName', name);
    query.equalTo('tagOrderby', type);
    query.find().then(function (resultes) {
        if (resultes == null || resultes == '') {
            var result = {
                code : 600,
                message : '该标签不存在'
            }
            res.send(result);
        }
        else  {
            switch (level) {
                case '0' : resultes[0].set('tagUrl', url);break;
                case '1' : resultes[0].set('tagUrl1', url);break;
                case '2' : resultes[0].set('tagUrl2', url);break;
                case '3' : resultes[0].set('tagUrl3', url);break;
            }
            resultes[0].save().then(function (saved) {
                var result = {
                    code : 200,
                    data : saved,
                    message : '操作成功'
                }
                res.send(result);
            });
        }

    });
    
});

router.post('/debase', function (req, res, next) {

    var userName = req.body.username;
    var askId = req.body.ask_id;
    var content = req.body.content;

    var query = new AV.Query('Haved');
    query.equalTo('userName', userName);
    query.equalTo('askId', askId);
    query.find().then(function (askList) {
        if (askList == null || askList == '') {
            var query = new AV.Query('AskMe');
            query.get(askId).then(function (ask) {

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

                    if (havedListFlag != 0) {

                        var query = new AV.Query('Debase');
                        query.equalTo('userName', userName);
                        query.equalTo('askId', askId);
                        query.find().then(function (debases) {

                            if (debases == null || debases == '') {

                                var debase = new Debase();
                                debase.set('userName', userName);
                                debase.set('askId', askId);
                                debase.set('content',content);
                                debase.save().then(function (debase) {
                                    ask.set('score', ask.get('score') - 5);
                                    ask.save().then(function (ask) {
                                        res.send({code:200,data:debase,message:'操作成功'});
                                    });

                                });



                            } else {

                                res.send({code:300,message:'重复操作'});

                            }

                        });





                    } else {
                        res.send({code:400,message:'尚未购买消息'});
                    }

                });

            });

        } else {
            res.send({code:400,message:'重复操作'});

        }
    });





});

router.post('/debaselist', function (req, res, next) {

    var askId = req.body.ask_id;

    var query = new AV.Query('Debase');
    query.equalTo('askId', askId);
    query.find().then(function (debaseList) {

        res.send({code:200,data:debaseList,message:'操作成功'});

    });

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

                var times = results[0].get("times");
                times++;
                results[0].set('times', times);
                results[0].save().then(function () {
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
                                var times = results[0].get("times");
                                times++;
                                results[0].set('times', times);
                                results[0].save().then(function () {
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
                                                var times = results[0].get("times");
                                                times++;
                                                results[0].set('times', times);
                                                results[0].save().then(function () {
                                                    if (tag.length == 3) {
                                                        callback.success('success');
                                                    }
                                                });

                                            }

                                        });
                                    }
                                });

                            }
                        });
                    }
                });

            }

        });
    }

}

function findUrl(type, tag, index, res) {
    // console.log(tag[index]);
    if (tag[index] == '' || tag[index] == null) {
        // console.log('ok');
        var result = {
            code : 404,
            url : '',
            message : '无效url'
        }
        res.send(result);
        return;
    }
    else {
        // console.log('find');
        // console.log(type);
        // console.log(tag);
        // console.log(index);
        var query = new AV.Query('Tag');
        query.equalTo('tagName', tag[index]);
        query.contains('tagOrderby', type);
        query.find().then(function (resultes) {
            //console.log(resultes);
            if (resultes == null || resultes == "") {
                //console.log('next');
                findUrl(type, tag, index + 1, res);
            }
            else {
                for (var i = 0; i < resultes.length; i++ ) {
                    if ((type.indexOf(resultes[i].get('tagOrderby')) >= 0  || resultes[i].get('tagOrderby').indexOf(type) >= 0) && resultes[i].get('tagUrl') != null) {
                        var result = {
                            code : 200,
                            url : resultes[i],
                            message : '操作成功'
                        }
                        res.send(result);
                        return;
                    }
                }
                //console.log('next');
                findUrl(type, tag, index + 1, res);
            }
        });
    }
}

function getFlatternDistance(lat1,lng1,lat2,lng2){
    var f = getRad((lat1 + lat2)/2);

    var g = getRad((lat1 - lat2)/2);

    var l = getRad((lng1 - lng2)/2);



    var sg = Math.sin(g);

    var sl = Math.sin(l);

    var sf = Math.sin(f);



    var s,c,w,r,d,h1,h2;

    var a = EARTH_RADIUS;

    var fl = 1/298.257;



    sg = sg*sg;

    sl = sl*sl;

    sf = sf*sf;



    s = sg*(1-sl) + (1-sf)*sl;

    c = (1-sg)*(1-sl) + sf*sl;



    w = Math.atan(Math.sqrt(s/c));

    r = Math.sqrt(s*c)/w;

    d = 2*w*a;

    h1 = (3*r -1)/2/c;

    h2 = (3*r +1)/2/s;



    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));

}

module.exports = router;
