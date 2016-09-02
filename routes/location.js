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

function ifexitCard(data,callback){
    var query = new AV.Query('Location');
    for(var key in data){
        query.equalTo(key, data[key]);
    }
    query.find().then(function (locationList) {
        callback.success(locationList);
    },function (error) {
        callback.error(error);
    });
}

router.post('/addlocation', function(req, res, next) {

    var geox = req.body.geox;
    var geoy = req.body.geoy;
    var hot  = req.body.hot;
    var address  = req.body.address;
    var hot = parseInt(hot);

    if(!geox || !geoy || !address){
        res.send({code:600,  message:'缺少参数'});
        return;
    }
    var data = {
            GeoX    : geox,
            GeoY    : geoy,
            hot     : hot,
            address : address
        }
    ifexitCard(data,{
        success:function(locationList){
            if(!locationList.length){
                var location = new Location();
                location.set('GeoX', geox);
                location.set('GeoY', geoy);
                location.set('hot', hot);
                location.set('address', address);
                location.save().then(function (cardList) {
                    res.send({code:200,  data:cardList, message:'操作成功'});
                },function(error){
                    res.send({code:400,  message:'操作失败'});
                    console.log(error);
                });
            }else{
                res.send({code:300, message:'地址已存在'});
            }
        },
        error:function(error){
            res.send({code:400,  message:'操作失败'});
        }
    })
});


router.post('/editlocation', function(req, res, next) {

    var localtionId = req.body.id;
    var hot = req.body.hot;

    var hot = parseInt(hot);

    if(!localtionId){
        res.send({code:600,  message:'缺少参数'});
        return;
    }

    var query = new AV.Query('Location');

    query.get(localtionId).then(function (Location) {

        if(hot){
           Location.set('hot', hot); 
        }
        
        Location.save().then(function (location) {
            res.send({code:200,  data:location, message:'操作成功'});
        },function(error){
            res.send({code:400,  message:'操作失败'});
            console.log(error);
        });
    });
});

router.post('/dellocation', function(req, res, next) {

    var locationID = req.body.location_id;
    if(!locationID){
        res.send({code:600,  message:'缺少参数'});
        return;
    }

    var action = AV.Object.createWithoutData('Location', locationID);
    action.destroy().then(function (success) {
        // 删除成功
        res.send({code:200,message:'删除成功'});
    }, function (error) {
        // 删除失败
        res.send({code:400,message:'删除失败'});
    });
});

module.exports = router;
