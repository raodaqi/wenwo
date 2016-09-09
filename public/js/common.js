// $.showPreloader();

var WX_SHARE_TITLE,
    WX_SHARE_LINK,　
    WX_SHARE_IMGURL,　
    WX_SHARE_DESC;
function formatDate(format, timestamp, full) {
    format = format.toLowerCase();
    if (!format) format = "y-m-d h:i:s";

    function zeroFull(str) {
        // console.log(full);
        // return full ? (str >= 10 ? str : ('0' + str)) : str;
        return (str >= 10 ? str : ('0' + str));
    }
    var time = new Date(timestamp),
        o = {
            y: time.getFullYear(),
            m: zeroFull(time.getMonth() + 1),
            d: zeroFull(time.getDate()),
            h: zeroFull(time.getHours()),
            i: zeroFull(time.getMinutes()),
            s: zeroFull(time.getSeconds())
        };
    return format.replace(/([a-z])(\1)*/ig, function(m) {
        return o[m];
    });
};

function formatTag(tag){
  if(tag){
    var tag = JSON.parse(tag);
    return tag[0].tag_name;
  }
}


function formatType(type) {
    switch (type) {
        case '0':
            return "问我";
            break;
        case '1':
            return "美食";
            break;
        case '2':
            return "住宿";
            break;
        case '3':
            return "交通";
            break;
        case '4':
            return "购物";
            break;
        case '5':
            return "游玩";
            break;
        case '6':
            return "防坑";
            break;
    }
}

function setCookie(name,value) 
{ 
    var Days = 1; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value); 
} 

function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 


function getAddress(lnglatXY,callback){
      var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });        
        geocoder.getAddress(lnglatXY, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              var address = result.regeocode; //返回地址描述
              // console.log(address);
              callback.success(address);
              // console.log(address);

              // if(type == "detail"){
              //   console.log(address.formattedAddress);
              //   return address.formattedAddress;
              // }
              var address = {
                province : address.addressComponent.province,
                city     : address.addressComponent.city,
                district : address.addressComponent.district
              }
              // console.log(address);
              // return address;
            }
        }); 
    }

function GetLength(str) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
};

// function formatTextLength(str,length){
//   var realLength = 0, 
//       len = str.length, 
//       charCode = -1;

//   for (var i = 0; i < len; i++) {
//     charCode = str.charCodeAt(i);
//     if (charCode >= 0 && charCode <= 128) realLength += 1;
//     else realLength += 2;
//     if(realLength >= length){
//       return str.substr(0,realLength) + '...';
//     }
//   }
//   return str;
// }

//详情内容隐藏
function deShow(text){
      var str = {};
      str = text.split("##");
      var show = '';
      var hidden = '';
      var detail = ''
      for(var i = 0; i < str.length; i++){
        if(i%2){
          var starLen = ''
          for(var j = 0; j < str[i].length; j++){
            starLen += '*';
          }
          detail += '<span class="hidden-text">'+starLen+'</span>';
        }else{
          detail += str[i];
        }
      }
      $(".de-show").empty();
      $(".de-show").append(detail);
    }

$.showLoad = function(title){
  var text = title ? title : "";
  var load = '<div class="preloader-modal"><div class="modal-content"><div class="modal-inner"><i class="ui-loading-bright"></i><div class="modal-title">'+text+'</div></div></div></div>';
  $("body").append(load);
}
$.showIndicator = function(title){
  var text = title ? title : "";
  var load = '<div class="preloader-modal"><div class="modal-content"><div class="modal-inner"><i class="ui-loading-bright"></i><div class="modal-title">'+text+'</div></div></div></div>';
  $("body").append(load);
}
$.showPreloader = function(title){
  var text = title ? title : "";
  var load = '<div class="preloader-modal"><div class="modal-content"><div class="modal-inner"><i class="ui-loading-bright"></i><div class="modal-title">'+text+'</div></div></div></div>';
  $("body").append(load);
}
$.hideIndicator = function(){
  $(".preloader-modal").hide();
  $(".preloader-modal").remove();
}
$.hideLoad = function(){
  $(".preloader-modal").hide();
  $(".preloader-modal").remove();
}
$.hidePreloader = function(){
  $(".preloader-modal").hide();
  $(".preloader-modal").remove();
}
// $.showPreloader();
// $.showLoad();

//想吃 接口
  function like(username,askid,$_this,callback){
    var data = {
      username   : username,
      ask_id     : askid
    }
    $.ajax({
      type : "POST",
      data: data,
      dataType: "json",
      url : "/hode/foodlike",
      success: function(result){
        callback.success(result,$_this);
      },
      error:function(error){
        callback.error(error,$_this);
      },
    })
  }

  //取消想吃 接口
  function cancelLike(username,askid,$_this,callback){
    var data = {
      username   : username,
      ask_id     : askid
    }
    $.ajax({
      type : "POST",
      data: data,
      dataType: "json",
      url : "/hode/cancelfoodlike",
      success: function(result){
        callback.success(result,$_this);
      },
      error:function(error){
        callback.error(error,$_this);
      },
    })
  }

  //保留两位小数
  function leaveTwoPoint(str){
    if(!str || str == 0){
      return str;
    }
    return parseFloat(str).toFixed(2);
  }

  //保留两位小数
  function formatDis(askPosition,long){
    if(!askPosition){
      return "";
    }else{
      if(long < 10000){
        return askPosition.district;
      }else{
        if(askPosition.city){
          return askPosition.city +" "+ askPosition.district;
        }else{
          return askPosition.province +" "+ askPosition.district;
        }
      }
    }
    // formatDis(formatJSON(data[i].askPosition),long);
    // formatJSON(data[i].askPosition) ? (long > 10000 ? (formatJSON(data[i].askPosition).city +" "+ formatJSON(data[i].askPosition).district) : formatJSON(data[i].askPosition).district);
  }

  //格式化距离
  function formatRange(long){
    var range = '';
    if(long >= 1000){
      range = parseFloat(long/1000).toFixed(1) + "km";
    }else{
      range = parseInt(long) + "m";
    }
    return range;
  }

  //解析json字符串
  function formatJSON(str){
    //判断是否是标准json字符串
    if(str.indexOf("{") == -1 || str.indexOf("}") == -1){
      return '';
    }else{
      return JSON.parse(str);
    }
  }

  //解析价格
  function formatPrice(price){
    //判断是否是标准json字符串
    var priceFloat = parseFloat(price);
    if(priceFloat == 0 || priceFloat == "0.0"){
      $(".buy").text("免费瞅瞅");
      return "免费瞅瞅";
    }else{
      return price + "元瞅瞅";
    }
  }

  //监听可点击元素
  $("body").on("click",".wenwo-click",function(){
    var href = $(this).attr("data-href");
    if(href.split("#")[1]){
      $.router.load(href);
    }else{
      window.location.href ="/"+href;
    }
  })

  //经纬度之间的距离
  /**

     * approx distance between two points on earth ellipsoid

     * @param {Object} lat1

     * @param {Object} lng1

     * @param {Object} lat2

     * @param {Object} lng2

     */
    var EARTH_RADIUS = 6378137.0; //单位M 
    var PI = Math.PI; 

    function getRad(d){ 
      return d*PI/180.0; 
    } 

    function getFlatternDistance(lat1,lng1,lat2,lng2){
        lat1 = parseFloat(lat1);
        lng1 = parseFloat(lng1);
        lat2 = parseFloat(lat2);
        lng2 = parseFloat(lng2);

        if(lat1 == lat2 && lng1 == lng2){
          return 0;
        }

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