/**
 * Created by duckyRao on 2016/4/14.
 */
+(function(){

	// if (navigator.geolocation)
 //    {
 //    	navigator.geolocation.getCurrentPosition(showPosition);
 //    }
 //  	else{x.innerHTML="Geolocation is not supported by this browser.";}

 //  	function showPosition(position)
	// {
	//   // alert("Latitude: " + position.coords.latitude +"<br />Longitude: " + position.coords.longitude);
	//   var map = new AMap.Map('container',{
 //            resizeEnable: true,
 //            zoom: 10,
 //            center: [103.98,30.58]
 //      });
	// }

	var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(60, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'LB'
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
    }
    //解析定位错误信息
    function onError(data) {
        
    }

    AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
        var toolBar = new AMap.ToolBar();
        var scale = new AMap.Scale();
        map.addControl(toolBar);
        map.addControl(scale);
    })

     map.on('click', function(e) {
     	console.log(e);
        // alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
      var icon = new AMap.Icon({
          image : 'http://vdata.amap.com/icons/b18/1/2.png',//24px*24px
          //icon可缺省，缺省时为默认的蓝色水滴图标，
          size : new AMap.Size(24,24)
      });
      // var marker = new AMap.Marker({
      //         icon : icon,//24px*24px
      //         offset : new AMap.Pixel(e.lnglat.getLat(),e.lnglat.getLng()),
      //         map : map
      // });
      var marker = new AMap.Marker({
        icon : icon,//24px*24px
        map : map,
        position: [e.lnglat.getLng(),e.lnglat.getLat()],
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true
      });
      marker.setMap(map);
    });



     //地图搜索功能
    // var windowsArr = [];
    // var marker = [];
    // var mapObj = new AMap.Map("mapContainer", {
    //         resizeEnable: true,
    //         center: [116.397428, 39.90923],//地图中心点
    //         zoom: 13,//地图显示的缩放级别
    //         keyboardEnable: false
    // });

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
         console.log(e);
         placeSearch.search(e.poi.name)
      });
    });

    // var icon = new AMap.Icon({
    //         image : 'http://vdata.amap.com/icons/b18/1/2.png',//24px*24px
    //         //icon可缺省，缺省时为默认的蓝色水滴图标，
    //         size : new AMap.Size(24,24)
    // });
    // var marker = new AMap.Marker({
    //         icon : icon,//24px*24px
    //         position : provinces[i].center.split(','),
    //         offset : new AMap.Pixel(-12,-12),
    //         map : mapObj
    // });
    window.map = map;
}());