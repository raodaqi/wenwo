/**
 * Created by Ducky on 16/8/24.
 */

var async = require("async");
var router = require('express').Router();
var AV = require('leanengine');

var Location = AV.Object.extend('Location');

//获取卡片信息
function getCard(size,callback){
    var query = new AV.Query('Card');
    query.ascending('createdAt');

    if(size){
        query.limit(size);
    }

    query.find().then(function (cardList) {
        callback(null,cardList);
    },function (cardList) {
        callback(null,error);
    });
}

function ifLiked(askid,username){
    var query = new AV.Query('FoodLike');
    query.equalTo("by", username);

}

router.get('/gethotlist', function(req, res, next) {
    var query = new AV.Query('Location');
    query.descending('hot');
    query.limit(10);
    query.find().then(function (locationList) {
        var result = {
            code : 200,
            data : locationList,
            message : 'success'
        }
        res.send(result);
    },function (cardList) {
        res.send({code:400, message:'请求失败'});
    });
});


// router.get('/getcardlist', function(req, res, next) {
//     var size = req.query.size;
//     var query = new AV.Query('Card');
//     query.ascending('createdAt');

//     if(size){
//         query.limit('size');
//     }

//     query.find().then(function (cardList) {
//         res.send({code:200, data:cardList, message:'操作成功'});
//     },function (cardList) {
//         res.send({code:400, message:'请求失败'});
//     });
// });

router.post('/addDownNum', function(req, res, next) {
    var user = AV.User.current();
    var cardId = req.body.card_id;
    if(true){
        var query = new AV.Query('Card');
        query.get(cardId).then(function (card) {
            card.increment('downNum', 1);
            card.save().then(function (data) {
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

router.post('/addcard', function(req, res, next) {

    var byName = req.body.name;
    var cardImg = req.body.image;
    var detail  = req.body.detail;

    if(!name || !cardImg || !detail){
        res.send({code:600,  message:'缺少卡片内容'});
        return;
    }
    var data = {
            byName  : byName,
            cardImg : cardImg,
            detail  : detail
        }
    ifexitCard(data,{
        success:function(cardList){
            if(!cardList.length){
                var card = new Card();
                card.set('byName', byName);
                card.set('cardImg', cardImg);
                card.set('detail', detail);
                card.save().then(function (cardList) {
                    res.send({code:200,  data:cardList, message:'操作成功'});
                },function(error){
                    res.send({code:400,  message:'操作失败'});
                    console.log(error);
                });
            }else{
                res.send({code:300, message:'卡片已存在'});
            }
        },
        error:function(error){
            res.send({code:400,  message:'操作失败'});
        }
    })
});

function ifexitCard(data,callback){
    var query = new AV.Query('Card');
    for(var key in data){
        query.equalTo(key, data[key]);
    }
    query.find().then(function (cardList) {
        callback.success(cardList);
    },function (error) {
        callback.error(error);
    });
}

router.get('/addcardbyask', function(req, res, next) {

    var askId = req.query.askid;
    if(!askId){
        res.send({code:600,  message:'缺少参数'});
        return;
    }
    console.log(askId);
    var query = new AV.Query('AskMe');
    query.get(askId).then(function (ask) {
        console.log(ask);
        var byName = ask.attributes.createByName;
        if(ask.attributes.askImage){
            var cardImg = JSON.parse(ask.attributes.askImage)[0].image;
        }else{
            var cardImg = ask.attributes.createByUrl;
        }
        var detail = ask.attributes.askReason;
        var likeNum = parseInt(ask.attributes.likeNum);

        var data = {
            byName  : byName,
            cardImg : cardImg,
            detail  : detail
        }
        ifexitCard(data,{
            success:function(cardList){
                if(!cardList.length){
                    var card = new Card();
                    card.set('byName', byName);
                    card.set('cardImg', cardImg);
                    card.set('detail', detail);
                    card.set('askId', askId);
                    card.set('likeNum', likeNum);
                    var ask = AV.Object.createWithoutData('AskMe', askId);
                    card.set('ask', ask);

                    card.save().then(function (cardList) {
                        res.send({code:200,  data:cardList, message:'操作成功'});
                    },function(error){
                        res.send({code:400,  message:'操作失败'});
                        console.log(error);
                    });
                }else{
                    res.send({code:300, message:'卡片已存在'});
                }
            },
            error:function(error){
                res.send({code:400,  message:'操作失败'});
            }
        })
        
    },function(error){
        res.send({code:400,  message:'操作失败'});
    })
});


router.post('/editcarouselinfo', function(req, res, next) {

    var cardId = req.body.cardid;
    var byName = req.body.name;
    var cardImg = req.body.image;
    var detail  = req.body.detail;

    if(!askId){
        res.send({code:600,  message:'缺少参数'});
        return;
    }

    var query = new AV.Query('Card');

    query.get(cardId).then(function (Card) {
        if(byName){
           Card.set('byName', byName); 
        }

        if(cardImg){
           Card.set('cardImg', cardImg); 
        }

        if(detail){
           Card.set('detail', detail); 
        }
        
        Card.save().then(function (card) {
            res.send({code:200,  data:card, message:'操作成功'});
        },function(error){
            res.send({code:400,  message:'操作失败'});
            console.log(error);
        });
    });
});

router.post('/delcard', function(req, res, next) {

    var cardID = req.body.card_id;
    if(cardID){
        res.send({code:600,  message:'缺少参数'});
        return;
    }

    var action = AV.Object.createWithoutData('Card', cardID);
    action.destroy().then(function (success) {
        // 删除成功
        res.send({code:200,message:'删除成功'});
    }, function (error) {
        // 删除失败
        res.send({code:400,message:'删除失败'});
    });
});

module.exports = router;
