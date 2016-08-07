/**
 * Created by HanQi on 16/8/7.
 */

var router = require('express').Router();
var AV = require('leanengine');

var Carousel = AV.Object.extend('Carousel');

router.get('/getcarouselinfo', function(req, res, next) {

    var query = new AV.Query('Config');

    var configID = '57a71f565bbb5000642dd0a9';
    
    query.get(configID).then(function (config) {

        if (config.get('name') == 'carouselSize') {

            var carouselSize = parseInt(config.get('value'));
            var query = new AV.Query('Carousel');
            query.limit(carouselSize);
            query.descending('createdAt');
            query.find().then(function (carouselList) {

                res.send({code:200, data:carouselList, message:'操作成功'});
                
            });

        } else {

            //配置信息有误
            res.send({code:400,message:'配置信息有误'});

        }



    });


});

router.post('/addcarouselinfo', function(req, res, next) {

    var carouselName = req.body.name;
    var carouselClickURL = req.body.clickURL;
    var carouselImage = req.body.image;

    var query = new AV.Query('Config');

    var configID = '57a71f565bbb5000642dd0a9';

    query.get(configID).then(function (config) {

        if (config.get('name') == 'carouselSize') {

            var value = config.get('value');

            var carousel = new Carousel();
            carousel.set('carouselName', carouselName);
            carousel.set('carouselClickURL', carouselClickURL);
            carousel.set('carouselImage', carouselImage);
            carousel.save().then(function (carousel) {

                res.send({code:200,  data:carousel, message:'操作成功'});

            });


        } else {

            //配置信息有误
            res.send({code:400,message:'配置信息有误'});

        }



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



module.exports = router;
