function initLocation(type,callback) {
    var title = WX_SHARE_TITLE ? WX_SHARE_TITLE:'「问我」 发现身边美食';
    var link = WX_SHARE_LINK ? WX_SHARE_LINK :'http://www.wenwobei.com';//链接按代换
    var imgUrl　=　(WX_SHARE_IMGURL && WX_SHARE_IMGURL != "/") ? WX_SHARE_IMGURL: 'http://www.wenwobei.com/img/logo.jpg';//链接按代换
    var desc =　WX_SHARE_DESC ? WX_SHARE_DESC:'走到哪，吃到哪。让美食无处可逃!';
    
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
                    'getLocation',
                    'chooseImage',
                    'uploadImage'
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

                // 5.1 拍照、本地选图
                if(type == "edit"){
                  var localId = '';
                  var localIds = [];
                  document.querySelector('#photo').onclick = function () {
                    $(".photo-content").attr("data-percent","-1");
                    wx.chooseImage({
                      count: 1, // 默认9
                      success: function (res) {
                        localIds = res.localIds;
                        localId = localIds[0];
                        // alert('已选择 ' + res.localIds.length + ' 张图片');
                        console.log(res);
                        $(".photo-content").attr("src",localId);
                        $(".photo .edit-li-img").attr("src", "/img/edit/photo-02.png");
                        $(".photo-content").attr("data-percent","50");

                        wx.uploadImage({
                            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                localId = res.localIds;
                                var serverId = res.serverId; // 返回图片的服务器端ID
                                // $(".photo-content").attr("scr",serverId);
                                // $(".photo-content").attr("scr",localId);
                                $.ajax({
                                  type: "POST",
                                  url: '/todos/file_save',
                                  data: { server_id: serverId},
                                  dataType: "json",
                                  success: function(result) {
                                      console.log(result);
                                      if(result.code == 200){
                                        $(".photo-content").attr("data-href",result.data);
                                        $(".photo-content").attr("data-percent","100");
                                        localStorage["editImage"] = result.data;
                                      }else{
                                        $.toast("图片上传失败");
                                        $(".photo-content").attr("data-percent","-1");
                                      }   
                                  },
                                  error: function(error) {
                                    $.toast("网络异常");
                                    $(".photo-content").attr("data-percent","-1");
                                  }
                              })
                            }
                        });
                      }
                    });
                  };
                }

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
                            map.setZoomAndCenter(16, [longitude, latitude]);
                            $("#container").attr("data-longitude", longitude);
                            $("#container").attr("data-latitude", latitude);
                        }
                        if(callback){
                            callback.success(longitude,latitude);
                        }
                    },
                    cancel: function(error) {
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
            callback.error(error);
        }
    });
}

function onlyInitShare(){
    var title = WX_SHARE_TITLE ? WX_SHARE_TITLE:'「问我」 发现身边美食';
    var link = WX_SHARE_LINK ? WX_SHARE_LINK :'http://www.wenwobei.com';//链接按代换
    var imgUrl　=　(WX_SHARE_IMGURL && WX_SHARE_IMGURL != "/") ? WX_SHARE_IMGURL: 'http://www.wenwobei.com/img/logo.jpg';//链接按代换
    var desc =　WX_SHARE_DESC ? WX_SHARE_DESC:'走到哪，吃到哪。让美食无处可逃!';
    
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
    var title = WX_SHARE_TITLE ? WX_SHARE_TITLE:'「问我」 发现身边美食';
    var link = WX_SHARE_LINK ? WX_SHARE_LINK :'http://www.wenwobei.com';//链接按代换
    var imgUrl　=　(WX_SHARE_IMGURL && WX_SHARE_IMGURL != "/") ? WX_SHARE_IMGURL: 'http://www.wenwobei.com/img/logo.jpg';//链接按代换
    var desc =　WX_SHARE_DESC ? WX_SHARE_DESC:'走到哪，吃到哪。让美食无处可逃!';

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

function initChooseImage(){

}