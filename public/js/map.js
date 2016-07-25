/**
 * Created by duckyRao on 2016/4/14.
 */
+(function(){
	var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: true,
        zoom:19
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonDom:'<div class="geolocation-position"><img src="/img/position.png"></div>',
            buttonOffset: new AMap.Pixel(20, 25),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'LB',
            showCircle:false,
            useNative:true
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });


    //解析定位结果
    function onComplete(data) {
        var str=['定位成功'];
        str.push('经度：' + data.position.getLng());
        str.push('纬度：' + data.position.getLat());
        str.push('精度：' + data.accuracy + ' 米');
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
        console.log("定位成功");
    }
    //解析定位错误信息
    function onError(data) {
        
    }
    var timeIv;
    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
      var autoOptions = {
        input: "search"//使用联想输入的input的id
      };
      autocomplete= new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({
            map:map
      })
      AMap.event.addListener(autocomplete, "select", function(e){
         //TODO 针对选中的poi实现自己的功能
         console.log("123");
         console.log(e.poi);
         placeSearch.setCity(e.poi.adcode);
         placeSearch.search(e.poi.name);
         $.router.load("#router");
         //这里是设置一个延时来判断是否标注加载完成
         timeIv = setInterval(function(){
          console.log($(".amap-marker").length);
          if($(".amap-marker").length > 5){
            clearInterval(timeIv);
            // map.clearMap();
            $(".amap_lib_placeSearch_poi").hide();
          }
         }, 10);
      });
    });

    window.map = map;

    map.on("zoomchange",function(){
        console.log(map.getZoom());
        if(map.getZoom() > 14){
            // map.zoomOut();
            // map.setZoom(14);
        }
    })
}());