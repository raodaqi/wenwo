var data = {
      url   : location.href.split('#')[0]
    }
    $.ajax({
      type : "POST",
      data: data,
      dataType: "json",
      url : "/todos/test/wx",
      success : function(result){
        $(".ui-loading-block").hide();
        console.log(result);
        wx.config({
          debug: false,
          appId: 'wx99f15635dd7d9e3c',
          timestamp: result.timestamp,
          nonceStr: result.nonceStr,
          signature: result.signature,
          jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
              'onMenuProfile',
              'onMenuAddContact',
              'hideMenuItems',
              'showMenuItems',
              'getLocation'
          ]
        });
        wx.ready(function(){
          if(IMGURL){
            var shareData = {
              title: '问我——像个当地人一样去旅游',
              desc: '说走就走，我带着你，你带着钱。',
              link: IMGURL,
              imgUrl: 'http://wenwo.leanapp.cn/img/wx/share.jpg'
            };
          }else{
            var shareData = {
              title: '问我——像个当地人一样去旅游',
              desc: '说走就走，我带着你，你带着钱。',
              link: result.url,
              imgUrl: 'http://wenwo.leanapp.cn/img/wx/share.jpg'
            };
          }
          
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareQQ(shareData);
          wx.onMenuShareWeibo(shareData);
          wx.onMenuShareQZone(shareData);

          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
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
                map.setZoomAndCenter(14,[longitude,latitude]);
                $("#container").attr("data-longitude",longitude);
                $("#container").attr("data-latitude",latitude);
            },
            error: function(error){
              console.log(error);
            }
          });
        }); 
      },
      error:function(error){
        console.log(error);
        $(".ui-loading-block").hide();
      }
    });