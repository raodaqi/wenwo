function initLocation(callback) {
    var title = WX_SHARE_TITLE ? WX_SHARE_TITLE:'「问我」 让经验帮你赚钱';
    var link = WX_SHARE_LINK ? WX_SHARE_LINK :'http://wenwo.leanapp.cn';//链接按代换
    var imgUrl　=　WX_SHARE_IMGURL ? WX_SHARE_IMGURL: 'http://wenwo.leanapp.cn/img/logo.jpg';//链接按代换
    var desc =　WX_SHARE_DESC ? WX_SHARE_DESC:'任何人都可以分享自己的经验赚钱，不信，你试试！';
    
    var data = {
        url: location.href.split('#')[0]
    }
    $.ajax({
        type: "POST",
        data: data,
        dataType: "json",
        url: "/todos/test/wx",
        success: function(result) {
            $(".ui-loading-block").hide();
            console.log(result);
            console.log(desc);
            wx.config({
                debug: false,
                appId: 'wx99f15635dd7d9e3c',
                timestamp: result.timestamp,
                nonceStr: result.nonceStr,
                signature: result.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuProfile',
                    'onMenuAddContact',
                    'hideMenuItems',
                    'showMenuItems',
                    'getLocation'
                ]
            });
            wx.ready(function() {

                wx.showMenuItems({
                    menuList: [
                        'menuItem:profile',
                        'menuItem:addContact'
                    ] // 要显示的菜单项，所有menu项见附录3
                });

                var shareData = {
                    title: title,
                    desc:  desc,
                    link:  link,
                    imgUrl: imgUrl
                };

                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);

                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function(res) {
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        console.log(res);
                        // var map = new AMap.Map('container', {
                        //   resizeEnable: true,
                        //   zoom:18,
                        //   center: [longitude, latitude] 
                        // });
                        $.hidePreloader();
                        // if(!(localStorage.lng && localStorage.lat)){
                        //     map.setZoomAndCenter(14,[longitude,latitude]);
                        // }
                        if(map){
                            map.setZoomAndCenter(14, [longitude, latitude]);
                            $("#container").attr("data-longitude", longitude);
                            $("#container").attr("data-latitude", latitude);
                        }
                        if(callback){
                            callback.success(longitude,latitude);
                        }
                    },
                    error: function(error) {
                        if(callback){
                            callback.error(error);
                        }
                        console.log(error);
                    }
                });
            });
        },
        error: function(error) {
            console.log(error);
            $(".ui-loading-block").hide();
        }
    });
}

function onlyInitShare(){
    var title = WX_SHARE_TITLE ? WX_SHARE_TITLE:'「问我」 让经验帮你赚钱';
    var link = WX_SHARE_LINK ? WX_SHARE_LINK :'http://wenwo.leanapp.cn';//链接按代换
    var imgUrl　=　WX_SHARE_IMGURL ? WX_SHARE_IMGURL: 'http://wenwo.leanapp.cn/img/logo.jpg';//链接按代换
    var desc =　WX_SHARE_DESC ? WX_SHARE_DESC:'任何人都可以分享自己的经验赚钱，不信，你试试！';
    
    var data = {
        url: location.href.split('#')[0]
    }
    $.ajax({
        type: "POST",
        data: data,
        dataType: "json",
        url: "/todos/test/wx",
        success: function(result) {
            $(".ui-loading-block").hide();
            console.log(result);
            console.log(desc);
            wx.config({
                debug: false,
                appId: 'wx99f15635dd7d9e3c',
                timestamp: result.timestamp,
                nonceStr: result.nonceStr,
                signature: result.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuProfile',
                    'onMenuAddContact',
                    'hideMenuItems',
                    'showMenuItems'
                ]
            });
            wx.ready(function() {
                var shareData = {
                    title: title,
                    desc:  desc,
                    link:  link,
                    imgUrl: imgUrl
                };

                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);
            });
        },
        error: function(error) {
            console.log(error);
            $(".ui-loading-block").hide();
        }
    });
}
function initShare(){
    var title = WX_SHARE_TITLE ? WX_SHARE_TITLE:'「问我」 让经验帮你赚钱';
    var link = WX_SHARE_LINK ? WX_SHARE_LINK :'http://wenwo.leanapp.cn';//链接按代换
    var imgUrl　=　WX_SHARE_IMGURL ? WX_SHARE_IMGURL: 'http://wenwo.leanapp.cn/img/logo.jpg';//链接按代换
    var desc =　WX_SHARE_DESC ? WX_SHARE_DESC:'任何人都可以分享自己的经验赚钱，不信，你试试！';

    wx.ready(function() {
        var shareData = {
            title: title,
            desc:  desc,
            link:  link,
            imgUrl: imgUrl
        };
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
    });
}

function ifAttention(access_token,openid){
    var data = {
        access_token: access_token,
        openid      : openid
    }
    $.ajax({
        type: "POST",
        data: data,
        dataType: "json",
        url: "/todos/attention",
        success: function(result) {
            console.log(result);
            $("body").empty().text(result);
        },
        error: function(error) {
            $("body").empty().text(error);
        }
    });
}