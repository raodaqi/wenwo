/**
 * Created by HanQi on 16/8/7.
 */

var router = require('express').Router();
var AV = require('leanengine');

var Carousel = AV.Object.extend('Carousel');
var TopicLike = AV.Object.extend('TopicLike');

router.get('/getcarouselinfo', function(req, res, next) {
    var reqType = req.query.type;
    var userName = req.query.username;

    var query = new AV.Query('Carousel');

    if(reqType != "all"){
        query.equalTo('show', 1);
    }else{
        query.descending('likeNum');
    }
    query.find().then(function (carouselList) {
        if(userName){
            var query = new AV.Query('TopicLike');
            query.equalTo("by", userName);
            query.find().then(function (topicLikes) {
                for(var i = 0; i < carouselList.length; i++){
                    var flag = 0;
                    for ( var k = 0; k < topicLikes.length; k++) {
                        if (topicLikes[k].get('carousel').id == carouselList[i].id) {
                            flag ++;
                            carouselList[i].set('liked', 1);
                            break;
                        }
                    }
                    if (flag == 0) {
                        carouselList[i].set('liked', 0);
                    }
                }
                res.send({code:200, data:carouselList, message:'操作成功'});
            },function(){
                res.send({code:400, message:'请求失败'});
            })
        }else{
            res.send({code:200, data:carouselList, message:'操作成功'});
        }
    },function (carouselList) {
        res.send({code:400, message:'请求失败'});
    });
});

router.get('/gettopiclikelist', function(req, res, next) {
    var userName = req.query.username;

    var query = new AV.Query('TopicLike');
    query.ascending('liked');
    query.equalTo("by", userName);
    query.include('carousel');
    query.find().then(function (topicLikes) {
        var data = new Array();
        for ( var i = 0; i < topicLikes.length; i++) {
            data[i] = topicLikes[i].get('carousel');
            data[i].set('liked', 1);
        }
        res.send({code:200, data:data, message:'操作成功'});
    },function(){
        res.send({code:400, message:'获取信息失败'});
    })
});

router.post('/addcarouselinfo', function(req, res, next) {

    var carouselName = req.body.name;
    var carouselClickURL = req.body.clickURL;
    var carouselImage = req.body.image;
    var show  = req.body.show;
    show  = parseInt(show);

    var query = new AV.Query('Config');

    var configID = '57a71f565bbb5000642dd0a9';

    query.get(configID).then(function (config) {

        if (config.get('name') == 'carouselSize') {

            var value = config.get('value');

            var carousel = new Carousel();
            carousel.set('carouselName', carouselName);
            carousel.set('carouselClickURL', carouselClickURL);
            carousel.set('carouselImage', carouselImage);
            carousel.set('show', show);
            carousel.save().then(function (carousel) {

                res.send({code:200,  data:carousel, message:'操作成功'});

            },function(error){
                res.send({code:400,  message:'操作失败'});
                console.log(error);
            });


        } else {

            //配置信息有误
            res.send({code:400,message:'配置信息有误'});

        }



    });


});

router.post('/editcarouselinfo', function(req, res, next) {

    var carouselName = req.body.name;
    var carouselId = req.body.id;
    var carouselClickURL = req.body.clickURL;
    var carouselImage = req.body.image;
    var show  = req.body.show;
    show  = parseInt(show);

    var query = new AV.Query('Carousel');

    query.get(carouselId).then(function (carousel) {
        carousel.set('carouselName', carouselName);
        carousel.set('carouselClickURL', carouselClickURL);
        carousel.set('carouselImage', carouselImage);
        carousel.set('show', show);
        carousel.save().then(function (carousel) {
            res.send({code:200,  data:carousel, message:'操作成功'});

        },function(error){
            res.send({code:400,  message:'操作失败'});
            console.log(error);
        });
    });
});

router.post('/delcarouselinfo', function(req, res, next) {

    var carouselID = req.body.carousel_id;

    var action = AV.Object.createWithoutData('Carousel', carouselID);
    action.destroy().then(function (success) {

        // 删除成功
        res.send({code:200,message:'操作成功'});

    }, function (error) {

        // 删除失败
        res.send({code:400,message:error});


    });


});

router.post('/setcarouselsize', function(req, res, next) {

    var carouselSize = req.body.size;

    var configID = '57a71f565bbb5000642dd0a9';

    var query = new AV.Query('Config');
    query.get(configID).then(function (config) {

        if (config.get('name') == 'carouselSize') {

            var value = config.get('value');

            if (carouselSize != value) {

                config.set('value', carouselSize);
                config.save().then(function (config) {

                    res.send({code:200, data:config, message:'操作成功'});

                });

            } else {

                //修改值与原值相同
                res.send({code:100,message:'修改值与原值相同'});

            }

        } else {

            //配置信息有误
            res.send({code:400,message:'配置信息有误'});

        }


    });


});

router.get('/getcarouselsize', function(req, res, next) {

    var configID = '57a71f565bbb5000642dd0a9';

    var query = new AV.Query('Config');
    query.get(configID).then(function (config) {

        if (config.get('name') == 'carouselSize') {

            res.send({code:200, data:config, message:'操作成功'});

        } else {

            //配置信息有误
            res.send({code:400,message:'配置信息有误'});

        }


    });


});

router.post('/topiclike', function(req, res, next) {
    var userName = req.body.username;

    var carouselId = req.body.carousel_id;

    var query = new AV.Query('UserInfo');
    query.get(userName).then(function (user) {

        var query = new AV.Query('Carousel');
        query.get(carouselId).then(function (carousel) {

            var query = new AV.Query('TopicLike');

            query.equalTo("by", userName);
            query.find().then(function (topicLikes) {
                var flag = 0;
                for (var i = 0; i < topicLikes.length; i++) {
                    if (topicLikes[i].get('carousel').id == carouselId) {
                        flag++;
                        break;
                    }
                }
                if (flag == 0) {

                    var topicLike = new TopicLike();
                    topicLike.set('carousel', carousel);
                    topicLike.set('by', userName);
                    topicLike.set('byName', user.get('uName'));
                    topicLike.set('byUrl', user.get('userHead'));
                    topicLike.save().then(function (re) {

                        carousel.increment('likeNum', 1);
                        carousel.save().then(function () {
                            var result = {
                                code : 200,
                                data : re,
                                message : '操作成功'
                            };
                            res.send(result);
                            return;
                        });
                    });
                } else  {
                    var result = {
                        code : 400,
                        message : '重复操作'
                    };
                    res.send(result);
                    return;
                }
            });

        });
        
    });
});

router.post('/canceltopiclike', function(req, res, next) {
    var userName = req.body.username;

    var carouselId = req.body.carousel_id;

    var query = new AV.Query('UserInfo');
    query.get(userName).then(function (user) {

        var query = new AV.Query('Carousel');
        query.get(carouselId).then(function (carousel) {

            var query = new AV.Query('TopicLike');

            query.equalTo("by", userName);
            query.find().then(function (topicLikes) {
                var flag = 0;
                for (var i = 0; i< topicLikes.length; i++) {
                    if (topicLikes[i].get('carousel').id == carouselId) {

                        var topicLike = AV.Object.createWithoutData('TopicLike', topicLikes[i].id);
                        
                        topicLike.destroy().then(function (success) {

                            carousel.increment('likeNum', -1);
                            carousel.save().then(function () {

                                var result = {
                                    code : 200,
                                    message : '操作成功'
                                };
                                res.send(result);
                                return;

                            });

                        }, function (error) {
                            var result = {
                                code : 400,
                                message : '操作失败'
                            };
                            res.send(result);
                            return;
                        });

                        flag++;
                        break;
                    }

                }
                if (flag == 0) {

                    var result = {
                        code : 400,
                        message : '操作失败'
                    };
                    res.send(result);
                    return;
                }
            });

        });

    });
});




module.exports = router;
