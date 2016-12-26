  //下拉刷新
  var map = '',
      LAT,
      LNG,
      title1 = 1,
      title2 = 1,
      title3 = 1,
      title4 = 1;
  var range = 1000;
  var loading = false;
  var itemsPerLoad = 10;

  //初始化想吃和标签range

  if(localStorage.tagRange){
    $("#tag").attr("data-range",localStorage.tagRange);
  }
  if(localStorage.likeRange){
    $("#like").attr("data-range",localStorage.likeRange);
  }

  // window.onpopstate = function(event) {
  //   alert($(".page-current").id);
  //   // $(".amap-sug-result").hide(); 
  // };
  (function(){
      if(history.length < 2){
        localStorage["findTop"] = 0;
        localStorage["likeTop"] = 0;
        localStorage["tagTop"] = 0;
        localStorage["shareTop"] = 0;
        localStorage["buyTop"] = 0;

        localStorage["findAskNum"] = itemsPerLoad;
        localStorage["likeAskNum"] = itemsPerLoad;
        localStorage["tagAskNum"] = itemsPerLoad;  
      }
    })();

  initLocation("food",{
      success: function(lng, lat) {
          LAT = lat;
          LNG = lng;
          newfoodInit(lat,lng);
      },
      error: function(error) {
          $.toast("未获取到当前位置");
          newfoodInit(30.58128,103.990092,"cancel");
      }
  });

  //测试逻辑
  if(window.location.port == 3000){
    // newfoodInit(30.580596,103.982984);
    setTimeout(function(){
      // newfoodInit(30.580596,103.982984);
      newfoodInit(30.58128,103.990092);
    }, 300);
  }
  

function newfoodInit(lat,lng,locationPerssion){  

    LAT = lat;
    LNG = lng;
    $(".my-location-content").attr("data-lng",LNG);
    $(".my-location-content").attr("data-lat",LAT);

    var lnglatXY = [LNG,LAT];
      getAddress(lnglatXY,{
        success:function(address){
          // console.log(address);
          var detail = address.formattedAddress;
          var address = {
              province: address.addressComponent.province,
              city: address.addressComponent.city,
              district: address.addressComponent.district,
              township: address.addressComponent.township
          }

          var replace = "" + address.province + address.city + address.district + address.township + "";
          detail = detail.replace(replace, "");
          address.detail = detail;
          if(!(history.length > 1 && getCookie("lng") && getCookie("lat"))){
            // $(".nav-left-add").text(detail);
            if(locationPerssion == "cancel"){
              $(".nav-left-add").text("未获取到当前位置");
            }else{
              $(".nav-left-add").text(detail);
            }
          }

          //当前地址
          if(locationPerssion == "cancel"){
            $(".location-city").text("未获取到当前位置");
            $(".location-detail").text("点击获取当前位置");
          }else{
            $(".location-city").text(address.city);
            $(".location-detail").text(address.district + address.township + detail);
          }

          // $(".location-city").text(address.city);
          // $(".location-detail").text(address.district + address.township + detail);
          
        },
        error:function(error){
          console.log(error);
        }
      })

    if(history.length > 1 && getCookie("lng") && getCookie("lat")){
      LAT = getCookie("lat");
      LNG = getCookie("lng");
      var lnglatXY = [LNG,LAT];
      getAddress(lnglatXY,{
        success:function(address){
          // console.log(address);
          var detail = address.formattedAddress;
          var address = {
              province: address.addressComponent.province,
              city: address.addressComponent.city,
              district: address.addressComponent.district,
              township: address.addressComponent.township
          }

          var replace = "" + address.province + address.city + address.district + address.township + "";
          detail = detail.replace(replace, "");
          address.detail = detail;

          $(".nav-left-add").text(detail);
        },
        error:function(error){
          console.log(error);
        }
      })
    }

    // console.log(history.length);
    // alert(history.length);

    //预先加载20条
    if (LAT) {
      var findTop = localStorage.findTop;
      if(localStorage.findAskNum && localStorage.findAskNum != "0"){
        addItems(localStorage.findAskNum, 0,"find");
      }else{
        console.log(localStorage.findAskNum);
        addItems(itemsPerLoad, 0,"find");
      }
    }



  //初始化下载图片
  if(localStorage.downImg){
     $(".down-img").attr("src",localStorage.downImg);
  }

  // function randomSS(){
  //   var sslen = 45;
  //   var headUrlNum = Math.ceil(Math.random()*sslen);
  //   return "/img/ss/ss"+headUrlNum+".jpg";
  // }


  //生成美食信息
  function formatAsk(ask){
    var askLi = '<div class="wenwo-li" data-id="57ae95a0a633bd0057f3765e"><div class="wenwo-ask-img" style="background: url(http://o83np3eq2.bkt.clouddn.com/wenwo/1471057716839/tOPIhUv03jc-n2TdKnGab3cliq-PBh2ObpUe-xGUWf_URzGn7a4BZ5pxtX6me81_.png) center center / cover no-repeat;"><div class="wenwo-gradient"></div><div class="wenwo-look"><label class="iconfont icon-eyepageview"></label><label>112</label></div><div class="wenwo-add"><label class="iconfont icon-adress"></label><label>1.6km</label></div></div><div class="up-content"><img src="http://wx.qlogo.cn/mmopen/zngt7mjBQUdFiaKIVGQbhF0AHzzldiapRrfp4Un3ibbvyNUG8rpHzKeRPSFtqHqDZrPJgowmnDqbkYrgvDl3zXAK1YGAOdt23s8/" alt="" class="user-pic"><div class="ask-content"><div class="ask-reason">你要相信一个爱吃的胖子你要相信一个爱吃的胖子你要相信一个爱吃的胖子你要相信一个爱吃的胖子你要相信一个爱吃的胖子</div></div></div><div class="down-content"><div class="iconfont icon-taginfor tag-icon"></div><div class="down-tag-content"><div class="down-tag">火锅</div></div><div class="down-like"><span class="icon iconfont icon-likeEat"></span><label class="like-num">9</label></div></div></div>';
    var askLi ='<div class="wenwo-li" data-id="57ae95a0a633bd0057f3765e"><div class="up-content"><img src="http://wx.qlogo.cn/mmopen/zngt7mjBQUdFiaKIVGQbhF0AHzzldiapRrfp4Un3ibbvyNUG8rpHzKeRPSFtqHqDZrPJgowmnDqbkYrgvDl3zXAK1YGAOdt23s8/" alt="" class="user-pic"><div class="ask-content"><div class="ask-reason">你要相信一个爱吃的胖子你要相信一个爱吃的胖子你要相信一个爱吃的胖子你要相信一个爱吃的胖子你要相信一个爱吃的胖子</div></div></div><div class="down-content"> <div class="iconfont icon-taginfor tag-icon"></div><div class="down-tag-content"><div class="down-tag">火锅</div></div><div class="down-like no-img"><span class="iconfont icon-chidouren"></span><label class="like-num">9</label></div></div><div class="other-content"><div class="wenwo-look"><label class="iconfont icon-eyepageview"></label><label>112</label></div><div class="wenwo-add"><label class="iconfont icon-adress"></label><label>1.6km</label></div></div></div>';
    if(!ask){
      return;
    }
    var lat1 = ask.GeoX;
    var lng1 = ask.GeoY;
    var long = getFlatternDistance(lat1, lng1, LAT, LNG);
    // var askTag =  formatTag(ask.askTagStr);
    var askTag = ask.askTagStr;
    if(askTag){
      askTag = JSON.parse(askTag);
      var downTag = '';
      var len = 0;
      for(var i in askTag){
        len++;
        if(len > 3){
          break;
        }
        downTag += '<div class="down-tag">'+askTag[i].tag_name+'</div>';
      }
    }
    //学姐活动内容
    var headImage = ask.createByUrl;
    // var headImage = randomSS();

    if(ask.askImage && ask.askImage.length){
      var askImage = JSON.parse(ask.askImage);
      if(askImage[0].image){
        var ask = '<div class="wenwo-li" data-id="'+ask.objectId+'"><div class="wenwo-ask-img" style="background: url('+askImage[0].image+') center center / cover no-repeat;"><div class="wenwo-gradient"></div>'+(ask.vipCardContent && ask.vipCardImage ? '<div class="card-tip"><img src="/img/card/vip.png" class="vip-card-img" alt=""></div>' : '')+'<div class="wenwo-look"><label class="iconfont icon-eyepageview"></label><label> '+(ask.lookNum ? ask.lookNum : 0)+'</label></div><div class="wenwo-add"><label class="iconfont icon-adress"></label><label> '+formatRange(long)+'</label></div></div><div class="up-content"><img src="'+headImage+'" alt="" class="user-pic"><div class="ask-content"><div class="ask-reason">'+ask.askReason+'</div></div></div><div class="down-content"><div data-id="'+ask.objectId+'" class="click-hidden-button"></div><div class="iconfont icon-taginfor tag-icon"></div><div class="down-tag-content">'+downTag+'</div><div class="down-like ' + (ask                                                                                                                                                                                                                                                                                                                                                                                                         .liked ? "liked" : '') + '"><span class="iconfont icon-chidouren"></span><label class="like-num">'+ask.likeNum+'</label></div></div></div>';
        return ask;
      }
    }
    var ask ='<div class="wenwo-li" data-id="'+ask.objectId+'"><div class="up-content"><img src="'+headImage+'" alt="" class="user-pic"><div class="ask-content"><div class="ask-reason">'+ask.askReason+'</div></div></div><div class="down-content"> <div data-id="'+ask.objectId+'" class="click-hidden-button"></div> <div class="iconfont icon-taginfor tag-icon"></div><div class="down-tag-content">'+downTag+'</div><div class="down-like no-img ' + (ask.liked ? "liked" : '') + '"><span class="iconfont icon-chidouren"></span><label class="like-num">'+ask.likeNum+'</label></div></div><div class="other-content"><div class="wenwo-look"><label class="iconfont icon-eyepageview"></label><label > '+(ask.lookNum ? ask.lookNum : 0)+'</label></div><div class="wenwo-add"><label class="iconfont icon-adress"></label><label> '+formatRange(long)+'</label></div></div></div>';
    return ask;
  }

  //初始化轮播图功能
  function sendQuest(url,type,data,callback){
    $.ajax({
      type: type,
      url: url,
      data: data,
      dataType: "json",
      success:function(result){
        if(result.code == 200){
          callback.success(result);
        }else{
          callback.error(result);
        }
      },
      error:function(error){
        $.toast("服务器出错");
        callback.error(error);
      }
    })
  }
  function getCarouselInfo(data,callback){
    var url = "/carousel/getcarouselinfo",
        type = "GET",
        data = data;
    sendQuest(url,type,data,{
        success:function(result){
            callback.success(result);
        },
        error:function(error){
            callback.error(error);
        }
    })
  }
  function getTopicLikeList(data,callback){
    var url = "/carousel/gettopiclikelist",
        type = "GET",
        data = data;
    sendQuest(url,type,data,{
        success:function(result){
            callback.success(result);
        },
        error:function(error){
            callback.error(error);
        }
    })
  }
  //获取分类信息
  function getTag(data,callback){
    var url = "/ask/getalltag",
        type = "GET",
        data = data;
    sendQuest(url,type,data,{
        success:function(result){
            callback.success(result);
        },
        error:function(error){
            callback.error(error);
        }
    })
  }

  //获取卡片信息
  function getCardList(data,callback){
    var url = "/card/getcardlist",
        type = "GET",
        data = data;
    sendQuest(url,type,data,{
        success:function(result){
            callback.success(result);
        },
        error:function(error){
            callback.error(error);
        }
    })
  }

  function initCarousel(){
    getCarouselInfo({},{
      success:function(result){
          var data = result.data;
          var li = '';
          for(var i = 0 ; i < data.length; i++){
              li += '<div class="swiper-slide" data-href="'+data[i].carouselClickURL+'"><img src="'+data[i].carouselImage+'" alt=""></div>';
          }
          $("#find .swiper-wrapper").empty().append(li);
          //调用系统的init方法
          sw.init();
      },
      error:function(error){
          console.log(error);
      }
    })
  }
  initCarousel();

  // 添加'refresh'监听器
  $(document).on('refresh', '.pull-to-refresh-content', function(e) {
      // 刷新主页
      // 获取当前是所在页面
      var id = $(this).parent()[0].id;
      title1 = 1;
      title2 = 1;
      title3 = 1;
      title4 = 1;
      // console.log(id);
      switch (id) {
          case "find":
              initFindListPage(range);
              break;
          case "like":
              $(".want-content").hide();
              addItems(itemsPerLoad, 0,"like");
              break;
          case "share":
              initSharePage(UserName);
              break;
          case "buy":
              initBuyPage(UserName);
              break;
          case "new":
              initNewListPage(0,itemsPerLoad);
              break;
          case "mytopic":
              initMytopicListPage();
              break;
          case "tag":
              var tag = $("#tag .title").text();
              var tagRange = $("#tag").attr("data-range");
              tagRange = parseInt(tagRange);
              initTagListPage(0,itemsPerLoad,tag,tagRange);
              break;
          case "search":
              var keyword = $("#tag .keyword").val();
              var data = {
                  page: 0,
                  size: itemsPerLoad,
                  username: UserName,
                  keyword : keyword
                }
              initListPage(data,"search",{
                empty:function(){
                  getSearchLoad = 0;
                },
                load:function(){
                  getSearchLoad = 1;

                }
              });
              break;
          case "strategy":
            initStrategyListPage();
            break;
          case "tagfind":
              initTagPage();
              break;
          default:
              setTimeout(function() {
                  $.pullToRefreshDone('.pull-to-refresh-content');
              }, 1000);
              break;
      }
  });

  //加载热门地点逻辑
  function loadLocationList(){
    if(!$(".hot-location-content-li").length){
      var data = {};
      var url = "/location/gethotlist";
      var type = "GET";
      sendQuest(url,type,data,{
        success:function(locationList){
          var locationli = '';
          var data = locationList.data;
          for(var i = 0; i < data.length; i++){
            locationli += '<div class="hot-location-content-li" data-lat="'+data[i].GeoX+'" data-lng="'+data[i].GeoY+'">'+data[i].address+'</div>';
          }
          $(".hot-location-content").empty().append(locationli);
        },
        error:function(error){

        }
      })
    }
  }

  //下拉刷新初始化
  $.initPullToRefresh(".content");

  //判断是否关注过
  function getIfAttention(username) {
      var data = {
          username: username
      }
      $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: "/authorization/isfocus",
          success: function(result) {
              // console.log(result);
              if (result.code == 200) {
                  if (!result.isfocus) {
                      //用户未关注公众号
                      // $()
                      var focus = '<div class="isfocus-content"><div class="isfocus-title">关注「问我」才能查看总收益、接收结算通知<br/>长按二维码识别，公众号：wenwolo</div><img src="/img/qr.JPG" class="isfocus-img" alt=""></div>';
                      $(".detail-pic-content").empty().append(focus);
                      $(".detail-pic-content").show();
                      $("#me .list-content").hide();
                  } else {
                      $(".detail-pic-content").show();
                      $("#me .list-content").show();
                  }
              } else {
                  $(".detail-pic-content").show();
                  $("#me .list-content").show();
              }
          },
          error: function(error) {
              $.toast("服务器异常");
              $(".detail-pic-content").show();
              $("#me .list-content").show();
          },
      })
  }
  getIfAttention(UserName);

  //点击返回时主页bug修复
  $(".back").on("click",function(){
    //获取当前显示页面id
    setTimeout(function(){
      var url = $(".page-current")[0].id;
      $(".tab-item").removeClass("active");
      $("." + url).addClass("active");
    }, 10);
  })

  //点击分类查找无数据bug
  $("#tagfind .ask-end").on("click",function(){
    //获取当前显示页面id
    $("#tagfind .ask-end").hide();
    $("#tagfind .infinite-scroll-preloader .preloader").show();
    initTagPage();
  })

  //初始化主页链接
  function init() {
      var url = window.location.hash;
      if (url) {
          url = url.split("#")[1];
      } else {
          url = "find";
      }
      // console.log(url);
      // $.router.load(url);
      $(".tab-item").removeClass("active");
      $("." + url).addClass("active");
      switch (url) {
          case "share":
              initSharePage(UserName);
              break;
          case "buy":
              initBuyPage(UserName);
              break;
          case "find":
              // initStrategyListPage();
              break;
          case "like":
              if(localStorage.likeAskNum && localStorage.likeAskNum != "0"){
                addItems(localStorage.likeAskNum, 0,"like");
              }else{
                addItems(itemsPerLoad, 0,"like");
              }
              break;
          case "me":
              initSharePage(UserName);
              initBuyPage(UserName);
              initNewListPage(0,itemsPerLoad);
              break;
          case "new":
              var findTop = localStorage.findTop;
              // if(findTop > 1044){
              //   addItems(itemsPerLoad*2, 0,"new");
              // }else{
              //   addItems(itemsPerLoad, 0,"new");
              // }
              if(localStorage.findAskNum && localStorage.findAskNum != "0"){
                addItems(localStorage.findAskNum, 0,"new");
              }else{
                addItems(itemsPerLoad, 0,"new");
              }
              break;
          case "strategy":
            initStrategyListPage();
            break;
          case "mytopic":
            initMytopicListPage();
            break;
          case "card":
            initCardList();
            break;
          case "tagfind":
            initTagPage();
            break;
          case "search":
            initTagPage();
            break;
          case "slocation":
            loadLocationList();
            break;
          case "tag":
            // addItems(itemsPerLoad, 0,"tag");
            if(localStorage.tagAskNum && localStorage.tagAskNum != "0"){
              addItems(localStorage.tagAskNum, 0,"tag");
            }else{
              addItems(itemsPerLoad, 0,"tag");
            }
            //判断tagfind界面是否为空
            if(!$("#tagfind .wenwo-li").length){
              initTagPage();
            }
            break;
      }
  }

  //更新页面逻辑
  function updatePage(type) {
      switch (type) {
          case "#share":
              initSharePage(UserName);
              break;
          case "#buy":
              initBuyPage(UserName);
              break;
          case "#like":
              initLikeListPage(0, itemsPerLoad,-1);
              break;
          case "#me":
              initMePage(UserName);
              break;
          case "#new":
              initNewListPage(0,itemsPerLoad);
              break;
          case "tagfind":
              initTagPage();
              break;
          case "#strategy":
            initStrategyListPage();
            break;
      }
  }

  //获取美食信息
  function getAskMe(page, size, staus, username,range, callback) {
      var staus = staus ? staus : 1;
      var username = username ? username : '';
      if (LAT && range) {
          var data = {
              page: page,
              size: size,
              staus: staus,
              position_geo: LAT + "," + LNG,
              username: username,
              range : range
          }
      } else {
          var data = {
              page: page,
              size: size,
              staus: staus,
              username: username
          }
      }
      $.ajax({
          type: "GET",
          data: data,
          dataType: "json",
          url: "/ask/allask",
          success: function(result) {
              callback.success(result);
          },
          error: function(error) {
              callback.error(error);
          },
      })
  }

  //获取搜索美食信息列表
  function getSearch(data, callback) {
      // var staus = staus ? staus : 1;
      // var username = username ? username : '';
      // var data = {
      //   page: page,
      //   size: size,
      //   staus: staus,
      //   username: username,
      //   keyword : keyword
      // }
      $.ajax({
          type: "GET",
          data: data,
          dataType: "json",
          url: "/ask/search",
          success: function(result) {
              callback.success(result);
          },
          error: function(error) {
              callback.error(error);
          },
      })
  }

  //获取美食信息
  function getTagAskMe(data, callback) {
      $.ajax({
          type: "GET",
          data: data,
          dataType: "json",
          url: "/ask/gettagask",
          success: function(result) {
              callback.success(result);
          },
          error: function(error) {
              callback.error(error);
          },
      })
  }

  var timer = '';
  //双击头部返回头部
  $(".bar").on("doubleTap", function() {
    var type = $(this).parent()[0].id;
    // console.log(type);
      var scroolTime = 1;
      var scroolSppeed = $("#"+type+" .wenwo-ul").height() / 100;
      timer = setInterval(function() {
          var height = $("#"+type+" ."+type+"-content").scrollTop();
          if (height <= 0) {
              $("#"+type+" ."+type+"-content").scrollTop(0);
              clearInterval(timer);
          } else {
              height = height - scroolSppeed;
              $("#"+type+" ."+type+"-content").scrollTop(height);
          }
      }, scroolTime);
  })

  // function initDistance(){
  //   var title1Top = $(".title1").length ? $(".title1").offset().top : 10000;
  //   var title2Top = $(".title2").length ? $(".title2").offset().top : 10000;
  //   var title3Top = $(".title3").length ? $(".title3").offset().top : 10000;

  //   $(".distance-fixed").show();

  //   if(title1Top != 10000){
  //     $(".distance-fixed").text($(".title1").text());
  //     return;
  //   }

  //   if(title2Top != 10000){
  //     $(".distance-fixed").text($(".title2").text());
  //     return;
  //   }

  //   if(title3Top != 10000){
  //     $(".distance-fixed").text($(".title3").text());
  //     return;
  //   }
  // }

  //初始化滚动页面
  $(".pull-to-refresh-content").scroll(function() {
    //主页逻辑
    var findTop = $("#find .find-content").scrollTop();
    var findAskNum = $("#find .wenwo-li").length ? $("#find .wenwo-li").length : itemsPerLoad;
    if(findTop < 1200){
      findAskNum = itemsPerLoad; 
    }

    //想吃逻辑
    var likeTop = $("#like .like-content").scrollTop();
    var likeAskNum = $("#like .wenwo-li").length ? $("#like .wenwo-li").length : itemsPerLoad;
    if(likeTop < 1200){
      likeAskNum = itemsPerLoad; 
    }

    //标签逻辑
    var tagTop = $("#tag .tag-content").scrollTop();
    var tagAskNum = $("#tag .wenwo-li").length ? $("#tag .wenwo-li").length : itemsPerLoad;
    if(tagTop < 1200){
      tagAskNum = itemsPerLoad; 
    }

    var shareTop = $("#share .share-content").scrollTop();
    var buyTop = $("#buy .buy-content").scrollTop();

    localStorage["findTop"] = findTop;
    localStorage["findAskNum"] = findAskNum;

    localStorage["likeTop"] = likeTop;
    localStorage["likeAskNum"] = likeAskNum;

    localStorage["tagTop"] = tagTop;
    localStorage["tagAskNum"] = tagAskNum;

    localStorage["shareTop"] = shareTop;
    localStorage["buyTop"] = buyTop;
  })

  $("#find .find-content").scroll(function() {
      //判断是否存在这个标签
      var title1Top = $(".title1").length ? $(".title1").offset().top : 10000;
      var title2Top = $(".title2").length ? $(".title2").offset().top : 10000;
      var title3Top = $(".title3").length ? $(".title3").offset().top : 10000;
      var title4Top = $(".title4").length ? $(".title4").offset().top : 10000;
      var top = $("#find .find-content").scrollTop();

      // localStorage["top"] = top;

      //初始化固定
      var neddHeight = 44;

      if (title1Top < 44) {
          $(".distance-fixed").text($(".title1").text());
          $(".distance-fixed").show();
      }

      if (title2Top < 50) {
          $(".distance-fixed").text($(".title2").text());
          $(".distance-fixed").show();
      }

      if (title3Top < 50) {
          $(".distance-fixed").text($(".title3").text());
          $(".distance-fixed").show();
      }
      if (title4Top < 50) {
          $(".distance-fixed").text($(".title4").text());
          $(".distance-fixed").show();
      }
      

      if (top < 1) {
          $(".distance-fixed").hide();
      }
  })

  //获取用户想吃列表
  //获取美食信息
  function getLikeList(data, callback) {
      $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: "/hode/foodlikelist",
          success: function(result) {
              // console.log(result);
              callback.success(result);
          },
          error: function(error) {
              // console.log(error);
              callback.error(error);
          },
      })
  }

  //getAskLoad getNewLoad  0代表空闲 1代表占用
  var getAskLoad = 0,
      getTagLoad = 0,
      getSearchLoad = 0,
      getLikeLoad = 0,
      getNewLoad = 0;

  function addItems(number, lastIndex,type,keyword) {

      //屏蔽其他请求
      var page = Math.ceil(lastIndex / number);
      page = page ? page : 0;
      if(!getNewLoad){
        if(type == "new"){
          getNewLoad = 1;
          initNewListPage(page, number);
        }
      }

      if(!getSearchLoad){
        if(type == "search" && keyword){
          getSearchLoad = 1;
          var data = {
            page: page,
            size: number,
            username: UserName,
            keyword : keyword
          }
          initListPage(data,type,{
            empty:function(){
              getSearchLoad = 0;
            },
            load:function(){
              getSearchLoad = 1;
              // $("#"+type+" .infinite-scroll-preloader .preloader").hide();
              // $("#"+type+" .ask-end").show();
            }
          });
        } 
      }

      if(!getTagLoad){
        if(type == "tag"){
          getTagLoad = 1;
          var tag = $("#tag .title").text();
          var tagRange = $("#tag").attr("data-range");
          tagRange = parseInt(tagRange);
          // console.log(tagRange);
          initTagListPage(page, number,tag,tagRange);  
        }
      }

      if(!getLikeLoad){
        if(type == "like"){
          getLikeLoad = 1;
          var likeRange = $("#like").attr("data-range");
          likeRange = parseInt(likeRange);
          initLikeListPage(page, number,likeRange);  
        }
      }

      if (!getAskLoad) {
        if(type == "find"){
          getAskLoad = 1;
          $(".infinite-scroll-preloader").show();
          $(".no-ask-result").hide();

          getAskMe(page, number, '', UserName,range, {
              success: function(result) {
                  // 生成新条目的HTML
                  var html = '';
                  var data = result.data;

                  //没有信息的情况
                  if(page == 0 && data.length == 0){
                    // $(".ask-end").text("启禀陛下，没有更多信息了呢!");
                    $(".infinite-scroll-preloader").hide();
                    $(".no-ask-result").show();
                  }else{
                    $(".infinite-scroll-preloader").show();
                    $(".no-ask-result").hide();
                  }

                  if (data) {
                      for (var i = 0; i < data.length; i++) {
                         html += formatAsk(data[i]);
                      }
                      // 添加新条目
                      $('#find .wenwo-ul').append(html);
                      initTop();

                      getAskLoad = 0;

                      
                      if (number > data.length) {
                          // 加载完毕，则注销无限加载事件，以防不必要的加载
                          $.detachInfiniteScroll($('#find .infinite-scroll'));
                          // 删除加载提示符
                          // $('.infinite-scroll-preloader').remove();
                          $("#find .infinite-scroll-preloader .preloader").hide();
                          $("#find .ask-end").show();
                          // $('.infinite-scroll-preloader').append("")
                          getAskLoad = 1;
                          return;
                      }
                  }else{
                    $.detachInfiniteScroll($('#find .infinite-scroll'));
                    // 删除加载提示符
                    // $('.infinite-scroll-preloader').remove();
                    $("#find .infinite-scroll-preloader .preloader").hide();
                    $("#find .ask-end").show();
                    // $('.infinite-scroll-preloader').append("")
                    getAskLoad = 1;
                    return;
                  }

              },
              error: function(error) {}
          })
        }
      }
  }

  // 上次加载的序号

  var lastIndex = 20;

  // 注册'infinite'事件处理函数
  $(document).on('infinite', '#find .infinite-scroll-bottom', function() {

      var type = $(this).parent()[0].id;
      // 如果正在加载，则退出
      if (loading) return;

      // 设置flag
      loading = true;

      // 模拟1s的加载过程
      // setTimeout(function() {
      // 重置加载flag
      loading = false;

      // 更新最后加载的序号
      lastIndex = $('#'+type+' .wenwo-li').length;
      // console.log(lastIndex);

      // if(lastIndex < itemsPerLoad){
      //   $.detachInfiniteScroll($('#'+type+' .infinite-scroll'));
      //   // 删除加载提示符
      //   $("#"+type+" .infinite-scroll-preloader .preloader").hide();
      //   $("#"+type+" .ask-end").show();
      // }

      // 添加新条目
      addItems(itemsPerLoad, lastIndex,type);
      //容器发生改变,如果是js滚动，需要刷新滚动
      $.refreshScroller();
      // }, 1000);
  });

  //初始化滚动页面
  $("#new .pull-to-refresh-content").scroll(function() {
    var height = $(this).height();
    var ulHeight = $("#new .wenwo-ul").height();
    var scroll = $(this).scrollTop();
    if(scroll + height > ulHeight - 50){
      lastIndex = $('#new .wenwo-li').length;
      // 添加新条目
      addItems(itemsPerLoad, lastIndex,"new");
      //容器发生改变,如果是js滚动，需要刷新滚动
      $.refreshScroller();
    }
  })

  //初始化滚动页面
  $("#tag .pull-to-refresh-content").scroll(function() {
    var height = $(this).height();
    var ulHeight = $("#tag .wenwo-ul").height();
    var scroll = $(this).scrollTop();
    if(scroll + height > ulHeight - 50){
      lastIndex = $('#tag .wenwo-li').length;
      // 添加新条目
      addItems(itemsPerLoad, lastIndex,"tag");
      //容器发生改变,如果是js滚动，需要刷新滚动
      $.refreshScroller();
    }
  })

  //初始化滚动页面
  $("#search .infinite-scroll-bottom").scroll(function() {
    var height = $(this).height();
    var ulHeight = $("#search .wenwo-ul").height();
    var scroll = $(this).scrollTop();
    if(scroll + height > ulHeight - 50){
      lastIndex = $('#search .wenwo-li').length;
      // 添加新条目
      //容器发生改变,如果是js滚动，需要刷新滚动
      var keyword = $(".keyword").val();
      // console.log(keyword);
      addItems(itemsPerLoad, lastIndex,"search",keyword);
      $.refreshScroller();
    }
  })

  //初始化滚动页面
  $("#like .infinite-scroll-bottom").scroll(function() {
    var height = $(this).height();
    var ulHeight = $("#like .wenwo-ul").height();
    var scroll = $(this).scrollTop();
    if(scroll + height > ulHeight - 50){
      lastIndex = $('#like .wenwo-li').length;
      // 添加新条目
      //容器发生改变,如果是js滚动，需要刷新滚动
      var keyword = $(".keyword").val();
      // console.log(keyword);
      addItems(itemsPerLoad, lastIndex,"like");
      $.refreshScroller();
    }
  })

  // }
  // initData();
  // getAskMe(2,10);

  $.init();
  init();

  // $("#card .swiper-container").swiper();

  //初始化主页列表
  function initFindListPage(range) {
      //初始化主页列表，获取前20条信息
      getAskMe(0, itemsPerLoad, '', UserName,range, {
          success: function(result) {
              // 生成新条目的HTML
              var html = '';
              var data = result.data;

              if (data) {
                  for (var i = 0; i < data.length; i++) {

                      var lat1 = data[i].GeoX;
                      var lng1 = data[i].GeoY;
                      var long = getFlatternDistance(lat1, lng1, LAT, LNG);
                      // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatRange(long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                      html += formatAsk(data[i]);
                  }
                  // 添加新条目
                  // $(".distance-fixed").hide();
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  $('#find .wenwo-ul').empty();
                  $('#find .wenwo-ul').append(html);

                  initTop();

                  //初始化滚动加载逻辑
                  $.attachInfiniteScroll($('#find .infinite-scroll'));
                  // 删除加载提示符
                  // $('.infinite-scroll-preloader').remove();
                  $("#find .ask-end").hide();
                  $("#find .infinite-scroll-preloader .preloader").css("display", "inline-block");
                  getAskLoad = 0;

                  // $(".preloader").hide();
                  // $(".preloader-tip").text("刷新成功");
                  // $(".preloader-tip").show();
                  if(data.length < itemsPerLoad){
                    $.detachInfiniteScroll($('#find .infinite-scroll'));
                    // 删除加载提示符
                    $("#find .infinite-scroll-preloader .preloader").hide();
                    $("#find .ask-end").show();
                    getAskLoad = 1;
                  }
              }
          },
          error: function(error) {
              // $(".preloader").hide();
              // $(".preloader-tip").text("刷新失败");
              // $(".preloader-tip").show();
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }

  //初始化最新信息列表
  function initNewListPage(page, number,range) {
      //初始化最新列表，获取前20条信息
      getAskMe(page, number, '', UserName,range, {
          success: function(result) {
              // 生成新条目的HTML
              var html = '';
              var data = result.data;
              if (data) {
                  for (var i = 0; i < data.length; i++) {

                      var lat1 = data[i].GeoX;
                      var lng1 = data[i].GeoY;
                      var long = getFlatternDistance(lat1, lng1, LAT, LNG);
                      html += formatAsk(data[i]);
                  }
                  // 添加新条目
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  if(page == 0){
                    $('#new .wenwo-ul').empty();
                  }
                  
                  $('#new .wenwo-ul').append(html);

                  initTop();

                  //初始化滚动加载逻辑
                  // $.attachInfiniteScroll($('#new .infinite-scroll'));
                  // 删除加载提示符
                  // $('.infinite-scroll-preloader').remove();
                  $("#new .ask-end").hide();
                  $("#new .infinite-scroll-preloader .preloader").css("display", "inline-block");
                  getNewLoad = 0;
                  if (number > data.length) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    // $.detachInfiniteScroll($('#new .infinite-scroll'));
                    // 删除加载提示符
                    // $('.infinite-scroll-preloader').remove();
                    $("#new .infinite-scroll-preloader .preloader").hide();
                    $("#new .ask-end").show();
                    // $('.infinite-scroll-preloader').append("")
                    getNewLoad = 1;
                    return;
                }
              }else{
                // $.detachInfiniteScroll($('#new .infinite-scroll'));
                // 删除加载提示符
                // $('.infinite-scroll-preloader').remove();
                $("#new .infinite-scroll-preloader .preloader").hide();
                $("#new .ask-end").show();
                // $('.infinite-scroll-preloader').append("")
                getNewLoad = 1;
                return;
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }

  //添加搜索记录
  function addSearchLog(keyword){
    var data = {
        createBy  : UserName,
        keyword   : keyword
    }
    var url = '/ask/addsearchlog';
    var type = "GET";
    sendQuest(url,type,data,{
      success:function(result){
      },
      error:function(error){
      }
    })
  }

  //初始化搜索信息列表
  function initListPage(searchData,type,callback) {
      //初始化最新列表，获取前20条信息
      // addSearchLog(searchData.keyword);
      getSearch(searchData, {
          success: function(result) {
              // 生成新条目的HTML
              var html = '';
              var data = result.data;

               // $(".infinite-scroll-preloader").hide();
               //  var noResult = '<div class="no-address"><img src="/img/food/want-empty.svg" class="no-address-img" alt=""><label class="no-result">没有搜索结果</label><label>换个关键词试试</label></div>';
               //  $("#search .wenwo-ul").empty().append(noResult);
                

              if(type == "search"){

                //没有信息的情况
                if(searchData.page == 0 && data.length == 0){
                  // $(".ask-end").text("启禀陛下，没有更多信息了呢!");
                  $(".infinite-scroll-preloader").hide();
                  // $(".no-ask-result").show();
                  var noResult = '<div class="no-address"><img src="/img/food/want-empty.svg" class="no-address-img" alt=""><label class="no-result">没有搜索结果</label><label>换个关键词试试</label></div>';
                  $("#search .wenwo-ul").empty().append(noResult);
                }else{
                  $(".infinite-scroll-preloader").show();
                  $("#search .wenwo-ul").empty();
                }

                if(data.length > 0){
                  $("#search .search-box").hide();
                  $(".keyword-content").empty().hide();
                  $("#search .wenwo-ul-content").show();
                  // $("#search .wenwo-ul").show();
                }else{
                  $("#search .search-box").hide();
                  $(".keyword-content").empty().hide();
                  $("#search .wenwo-ul-content").show();
                  // $("#search .wenwo-ul").show();
                  return;
                }
              }
              

              if (data) {
                  for (var i = 0; i < data.length; i++) {

                      var lat1 = data[i].GeoX;
                      var lng1 = data[i].GeoY;
                      var long = getFlatternDistance(lat1, lng1, LAT, LNG);                    // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatDis(formatJSON(data[i].askPosition),long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                      html += formatAsk(data[i]);
                  }
                  // 添加新条目
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  if(searchData.page == 0){
                    $('#'+type+' .wenwo-ul').empty();
                  }
                  
                  $('#'+type+' .wenwo-ul').append(html);

                  initTop();

                  //初始化滚动加载逻辑
                  // $.attachInfiniteScroll($('#'+type+' .infinite-scroll'));
                  // 删除加载提示符
                  // $('.infinite-scroll-preloader').remove();
                  $("#"+type+" .ask-end").hide();
                  $("#"+type+" .infinite-scroll-preloader .preloader").css("display", "inline-block");
                  // typeLoad = 0;
                  if (searchData.size > data.length) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    // $.detachInfiniteScroll($('#'+type+' .infinite-scroll'));
                    // 删除加载提示符
                    $("#"+type+" .infinite-scroll-preloader .preloader").hide();
                    $("#"+type+" .ask-end").show();
                    // typeLoad = 1;
                    callback.load();
                    return;
                }
                callback.empty();
              }else{
                // $.detachInfiniteScroll($('#'+type+' .infinite-scroll'));
                // 删除加载提示符
                $("#"+type+" .infinite-scroll-preloader .preloader").hide();
                $("#"+type+" .ask-end").show();
                // typeLoad = 1;
                callback.load();
                return;
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }

  // function initListPage(searchData,type,typeLoad) {
  //     //初始化最新列表，获取前20条信息
  //     getSearch(searchData, {
  //         success: function(result) {
  //             // 生成新条目的HTML
  //             var html = '';
  //             var data = result.data;

  //             if(data.length > 0){
  //               $("#search .search-box").hide();
  //               $(".keyword-content").hide().empty();
  //             }

  //             if (data) {
  //                 for (var i = 0; i < data.length; i++) {

  //                     var lat1 = data[i].GeoX;
  //                     var lng1 = data[i].GeoY;
  //                     var long = getFlatternDistance(lat1, lng1, LAT, LNG);                    // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatDis(formatJSON(data[i].askPosition),long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
  //                     html += formatAsk(data[i]);
  //                 }
  //                 // 添加新条目
  //                 $.pullToRefreshDone('.pull-to-refresh-content');
  //                 if(searchData.page == 0){
  //                   $('#search .wenwo-ul').empty();
  //                 }
                  
  //                 $('#search .wenwo-ul').append(html);

  //                 initTop();

  //                 //初始化滚动加载逻辑
  //                 // $.attachInfiniteScroll($('#search .infinite-scroll'));
  //                 // 删除加载提示符
  //                 // $('.infinite-scroll-preloader').remove();
  //                 $("#search .ask-end").hide();
  //                 $("#search .infinite-scroll-preloader .preloader").css("display", "inline-block");
  //                 getSearchLoad = 0;
  //                 if (number > data.length) {
  //                   // 加载完毕，则注销无限加载事件，以防不必要的加载
  //                   // $.detachInfiniteScroll($('#search .infinite-scroll'));
  //                   // 删除加载提示符
  //                   $("#search .infinite-scroll-preloader .preloader").hide();
  //                   $("#search .ask-end").show();
  //                   getSearchLoad = 1;
  //                   return;
  //               }
  //             }else{
  //               $.detachInfiniteScroll($('#search .infinite-scroll'));
  //               // 删除加载提示符
  //               $("#search .infinite-scroll-preloader .preloader").hide();
  //               $("#search .ask-end").show();
  //               getSearchLoad = 1;
  //               return;
  //             }
  //         },
  //         error: function(error) {
  //             $.pullToRefreshDone('.pull-to-refresh-content');
  //         }
  //     })
  // }

  //初始化标签列表
  function initTagListPage(page, number,tag,tagRange) {
      if(!tag){
        tag = localStorage.askTag;
      }
      $("#tag .title").text(tag);

      if(!page || page == "0"){
        $("#tag .wenwo-ul").empty();
        $("#tag .infinite-scroll-preloader .preloader").show();
        $("#tag .ask-end").hide();
      }

      if(tagRange > 0){
        var data = {
          page: page,
          size: number,
          username: UserName,
          position_geo: LAT + "," + LNG,
          range : tagRange,
          tag : tag
        }
      }else{
        var data = {
          page: page,
          size: number,
          username: UserName,
          tag : tag
        }
      }
      //初始化最新列表，获取前20条信息
      getTagAskMe(data, {
          success: function(result) {
              // 生成新条目的HTML
              var html = '';
              var data = result.data;
              if (data.length) {
                console.log(data);
                  for (var i = 0; i < data.length; i++) {

                      var lat1 = data[i].GeoX;
                      var lng1 = data[i].GeoY;
                      var long = getFlatternDistance(lat1, lng1, LAT, LNG);

                      // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatDis(formatJSON(data[i].askPosition),long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                    html += formatAsk(data[i]);
                  }
                  // 添加新条目
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  if(page == 0){
                    $('#tag .wenwo-ul').empty();
                  }
                  
                  $('#tag .wenwo-ul').append(html);

                  initTop();

                  //初始化滚动加载逻辑
                  // $.attachInfiniteScroll($('#tag .infinite-scroll'));
                  // 删除加载提示符
                  // $('.infinite-scroll-preloader').remove();
                  $(".change-sort").show();
                  $("#tag .want-content").hide();
                  $("#tag .ask-end").hide();
                  $("#tag .infinite-scroll-preloader .preloader").css("display", "inline-block");
                  getTagLoad = 0;
                  if (number > data.length) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    // $.detachInfiniteScroll($('#new .infinite-scroll'));
                    // 删除加载提示符
                    // $('.infinite-scroll-preloader').remove();
                    $("#tag .infinite-scroll-preloader .preloader").hide();
                    $("#tag .ask-end").show();
                    // $('.infinite-scroll-preloader').append("")
                    getTagLoad = 1;
                    return;
                }
              }else{
                // $.detachInfiniteScroll($('#new .infinite-scroll'));
                // 删除加载提示符
                // $('.infinite-scroll-preloader').remove();
                // $("#tag .infinite-scroll-preloader .preloader").hide();
                // $("#tag .ask-end").show();
                // $('.infinite-scroll-preloader').append("")
                $(".change-sort").hide();
                $("#tag .infinite-scroll-preloader .preloader").hide();
                $("#tag .ask-end").hide();
                $("#tag .want-content").show();
                getTagLoad = 1;
                return;
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }

  //初始化想吃列表
  function initLikeListPage(page, number,likeRange) {

      if(likeRange > 0){
        var data = {
          page: page,
          size: number,
          username: UserName,
          position_geo: LAT + "," + LNG,
          range : likeRange
        }
      }else{
        var data = {
          page: page,
          size: number,
          username: UserName
        }
      }
      //初始化最新列表，获取前20条信息
      getLikeList(data, {
          success: function(result) {
              // 生成新条目的HTML
              var html = '';
              var data = result.askDetail;
              if (data) {
                  for (var i = 0; i < data.length; i++) {

                      var lat1 = data[i].GeoX;
                      var lng1 = data[i].GeoY;
                      var long = getFlatternDistance(lat1, lng1, LAT, LNG);

                      // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatDis(formatJSON(data[i].askPosition),long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                    html += formatAsk(data[i]);
                  }
                  // 添加新条目
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  if(page == 0){
                    $('#like .wenwo-ul').empty();
                  }
                  
                  $('#like .wenwo-ul').append(html);

                  initTop();

                  //初始化滚动加载逻辑
                  // $.attachInfiniteScroll($('#tag .infinite-scroll'));
                  // 删除加载提示符
                  // $('.infinite-scroll-preloader').remove();
                  $("#like .ask-end").hide();
                  $("#like .infinite-scroll-preloader .preloader").css("display", "inline-block");
                  getLikeLoad = 0;
                  if (number > data.length) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    // $.detachInfiniteScroll($('#new .infinite-scroll'));
                    // 删除加载提示符
                    // $('.infinite-scroll-preloader').remove();
                    $("#like .infinite-scroll-preloader .preloader").hide();
                    $("#like .ask-end").show();
                    // $('.infinite-scroll-preloader').append("")
                    getLikeLoad = 1;
                    return;
                }
              }else{
                // $.detachInfiniteScroll($('#new .infinite-scroll'));
                // 删除加载提示符
                // $('.infinite-scroll-preloader').remove();
                $("#like .infinite-scroll-preloader .preloader").hide();
                $("#like .ask-end").show();
                // $('.infinite-scroll-preloader').append("")
                getLikeLoad = 1;
                return;
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }
  
  // //初始化想吃列表
  // function initLikeListPage() {
  //     //获取想吃列表

  //     getLikeList(UserName, {
  //         success: function(result) {
  //             if (result.code == 200) {
  //                 var html = '';
  //                 var data = result.askDetail;
  //                 if (!data.length) {
  //                     $("#like .infinite-scroll-preloader").hide();
  //                     $("#like .want-content").show();
  //                 }
  //                 if (data) {
  //                     for (var i = 0; i < data.length; i++) {
  //                         // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like liked"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
  //                          html += formatAsk(data[i]);
  //                     }
  //                 }
  //                 // 添加新条目
  //                 //清空原来的数据
  //                 $.pullToRefreshDone('.pull-to-refresh-content');
  //                 $('#like .wenwo-ul').empty();
  //                 $('#like .wenwo-ul').append(html);
  //                 $("#like .infinite-scroll-preloader .preloader").hide();
  //                 $("#like .ask-end").show();

  //                 initTop();
  //             }
  //         },
  //         error: function(error) {
  //             $.pullToRefreshDone('.pull-to-refresh-content');
  //         }
  //     })
  // }
  // initLikeListPage();

  //初始化美食攻略列表
  function initStrategyListPage() {
    //获取想吃列表
    getCarouselInfo({type:"all",username:UserName},{
          success: function(result) {
              if (result.code == 200) {
                var li = '';
                var data = result.data;
                for(var i = 0; i < data.length; i++){
                  li += '<div class="strategy-li" data-href="'+data[i].carouselClickURL+'" style="background: url('+data[i].carouselImage+') center center / cover no-repeat;"><div class="strategy-like-content" data-id="'+data[i].objectId+'"><div class="strategy-like-btn '+(data[i].liked ? 'strategy-liked' : '')+'" data-liked='+data[i].liked+'><div class="strategy-like iconfont icon-guanzhu"></div><div class="strategy-like-num">'+data[i].likeNum+'</div></div></div><div class="strategy-name">'+data[i].carouselName+'</div></div>';
                }
                // console.log(li);
                $.pullToRefreshDone('.pull-to-refresh-content');
                $("#strategy .strategy-ul").empty().append(li);
                $("#strategy .infinite-scroll-preloader .preloader").hide();
                $("#strategy .ask-end").empty().show();
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }

  //初始化美食攻略列表
  function initMytopicListPage() {
     $("#mytopic .want-content").hide();
    //获取想吃列表
    getTopicLikeList({username:UserName},{
          success: function(result) {
              if (result.code == 200) {
                var li = '';
                var data = result.data;
                for(var i = 0; i < data.length; i++){
                  li += '<div class="strategy-li" data-href="'+data[i].carouselClickURL+'" style="background: url('+data[i].carouselImage+') center center / cover no-repeat;"><div class="strategy-like-content" data-id="'+data[i].objectId+'"><div class="strategy-like-btn '+(data[i].liked ? 'strategy-liked' : '')+'" data-liked='+data[i].liked+'><div class="strategy-like iconfont icon-guanzhu"></div><div class="strategy-like-num">'+data[i].likeNum+'</div></div></div><div class="strategy-name">'+data[i].carouselName+'</div></div>';
                }
                $.pullToRefreshDone('.pull-to-refresh-content');
                $("#mytopic .mytopic-ul").empty().append(li);
                $("#mytopic .infinite-scroll-preloader .preloader").hide();
                $("#mytopic .ask-end").empty().show();
                if(!data.length){
                  $("#mytopic .want-content").show();
                }else{
                   $("#mytopic .want-content").hide();
                }
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }

  //初始化分类查找页面
  function initTagPage() {
    getTag({},{
          success: function(result) {
              if (result.code == 200) {
                // console.log(result);
                // var data = result.data;
                var type = result.type;
                // console.log(type);
                // var ul = '<div class="tagfind-tag-tip" style="top:2.2rem">点击标签，筛选美食</div>';
                var ul = '';
                var j = 0;
                var lastKey = '';
                var topNum = 44;
                var colorNum = 1;
                var color = '';
                var height = 44; 
                var typeCount = 0;

                for(var key in type){

                  if(type[key].length <= 6){
                    height += 2*39 + 15;
                  }else{
                    height += (2 + Math.ceil((type[key].length - 6) / 4)) * 39 + 15;
                  }

                  if(j != 0){
                    var length = 0;
                    if(type[lastKey].length <= 6){
                      length = 2;
                    }else{
                      length = 2 + Math.ceil((type[lastKey].length - 6) / 4);
                    }
                    topNum += length * 39 + 15;
                  }
                  lastKey = key;

                  //获取最后的坐标
                  // var lastPosition = topNum

                  j++;

                  ul += '<div class="tagfind-ul" style="top:'+topNum+'px;height='+height+'"><div class="type">'+key+'</div>';
                  var data = type[key];
                  var li = '';

                  function changeColor(){
                    if(colorNum){
                      colorNum = 0;
                      color = '';
                    }else{
                      colorNum = 1;
                      color = 'li-other-color';
                    }
                  }

                  for(var i = 0; i < data.length; i++){

                    if(i < 6){
                      if(i == 0){
                        changeColor();
                      }
                      if(i == 3){
                        changeColor();
                      }
                    }else{
                      if((i - 5)%4 == 1){
                       changeColor();
                      }
                    }

                    if(i == 2){
                      li += '<div class="tagfind-li '+color+' no-right-border li-border-top-right-radius">'+data[i].tagName+'</div>';
                      li+='<div class="border-bottom"></div>';
                      continue;
                    }
                    if(i == 5){
                      if(i == data.length - 1){
                        li += '<div class="tagfind-li '+color+' no-right-border li-border-bottom-right-radius">'+data[i].tagName+'</div>';
                      }else{
                        li += '<div class="tagfind-li '+color+' no-right-border">'+data[i].tagName+'</div>';
                      }
                      li+='<div class="border-bottom"></div>';
                      continue;
                    }

                    if(i > 5){
                      if((i - 5)%4 == 1){
                        li += '<div class="tagfind-li '+color+' li-border-bottom-left-radius">'+data[i].tagName+'</div>';
                        continue;
                      }

                      if((i - 5)%4 == 0){
                        if(i == data.length - 1){
                          li += '<div class="tagfind-li '+color+'  no-right-border li-border-bottom-right-radius">'+data[i].tagName+'</div>';
                          li += '<div class="border-bottom"></div>';
                        }else{
                          li += '<div class="tagfind-li '+color+' no-right-border">'+data[i].tagName+'</div>';
                          li+='<div class="border-bottom-all"></div>';
                        }
                        continue;
                      }
                    }
                    li += '<div class="tagfind-li '+color+'">'+data[i].tagName+'</div>';
                  }

                  for(var i = 0; i < 6 - data.length; i++){
                    if(data.length + i == 3){
                      changeColor();
                    }
                    if(data.length + i == 2){
                      li += '<div class="tagfind-li '+color+' no-right-border li-border-top-right-radius"></div>';
                      li += '<div class="border-bottom"></div>';
                    }else if(data.length + i == 5){
                      li += '<div class="tagfind-li '+color+' no-right-border li-border-bottom-right-radius"></div>';
                      li += '<div class="border-bottom"></div>';
                    }else{
                      li += '<div class="tagfind-li '+color+'"></div>';
                    }
                  }

                  if(data.length > 6 && (data.length-6)%4){
                    for(var i = 4 - (data.length-6)%4; i > 0 ; i--){
                      if(i == 1){
                        li += '<div class="tagfind-li '+color+' no-right-border li-border-bottom-right-radius"></div>';
                        li += '<div class="border-bottom"></div>';
                      }else{
                        li += '<div class="tagfind-li '+color+'"></div>';
                      }
                    }
                  }

                  // if(j == 0){
                  //   li += '<div class="hidden-box"></div>';
                  // }
                  ul += li + '</div>';
                }

                // ul += '<div class="type-empty" style="top:'+height+'px"></div>'
                // $("#tagfind .wenwo-ul").css({
                //   "height" : height + 44 + 15
                // })

                var tagLi = '';
                for(var i = 0 ; i < type["热门"].length; i++){
                  tagLi += '<div class="hot-tag-li">'+type["热门"][i].tagName+'</div>';
                }
                $(".hot-tag-content").empty().append(tagLi);

                $.pullToRefreshDone('.pull-to-refresh-content');
                $("#tagfind .wenwo-ul").empty().append(ul);
                $("#tagfind .infinite-scroll-preloader .preloader").hide();
                $("#tagfind .ask-end").empty().show();
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }

  $(".tab-item").on("click", function() {
      // console.log($());
      var type = $(this).attr("data-type");
      var active = $(".active").attr("data-type");
      $(".tab-item").removeClass("active");
      $(this).addClass("active");
      if (type == active) {
          return;
      }
      if (type == "like") {
          $(".pull-to-refresh-arrow").hide();
          if(!$("#like .wenwo-li").length){
            if(localStorage.likeAskNum && localStorage.likeAskNum != "0"){
              addItems(localStorage.likeAskNum, 0,"like");
            }else{
              addItems(itemsPerLoad, 0,"like");
            }
          }
          $.router.load("#like");

          setTimeout(function() {
              $(".pull-to-refresh-arrow").show();
          }, 500);
      } else if (type == "find") {
          //缓存个人中心列表，想吃列表
          $(".pull-to-refresh-arrow").hide();
          updatePage("#me");
          updatePage("#like");
          // updatePage("#strategy");
          updatePage("#tagfind");
          $.router.load("#find",false,"left");

          setTimeout(function() {
              $(".pull-to-refresh-arrow").show();
          }, 500);
      } else if (type == "edit") {
          // $.router.load("/edit");
          //设置cookie
          setCookie("lat",LAT);
          setCookie("lng",LNG);

          $.showPreloader("正在跳转");
          window.location.href = "/edit";
      }
  })

  // $(".edit").on("click",function(){
  //   $.showPreloader("正在跳转");
  //   window.location.href="/edit";
  // })

  //监听搜索按钮
  $("#find").on("click",".header-search",function(){
    var href = $(this).attr("data-href");
    if(href.split("#")[1] == "search"){
      initTagPage();
    }
  })

  $(".empty-button,.nav-list").on("click", function() {
      var href = $(this).attr("data-href");
      var id = $(".page-current")[0].id;

      if(href.split("#")[1] == "strategy" && !$("#strategy .strategy-li").length){
        initStrategyListPage();
      }

      if(href.split("#")[1] == "card" && !$("#card .card-li").length){
        initCardList();
      }

      if(href.split("#")[1] == "tagfind" && !$("#tagfind .tagfind-ul").length){
        // $(".tagfind-tag-tip").hide();
        // setTimeout(function() {
        //   $(".tagfind-tag-tip").show();
        // }, 1000);
        initTagPage();
      }

      if (href.split("#")[1]) {
        if(id != href.split("#")[1]){
          $(".tab-item").removeClass("active");
          $(".find").addClass("active");
          $.router.load(href);
        }  
      } else {
          $.showPreloader("正在跳转");
          $.router.load(href);
      }
  });
  $(".my-ask .item-link").on("click", function() {
    var href = $(this).attr("data-href");
    if(href == "#mytopic"){
      if(!$(".mytopic-ul .strategy-li").length){
        initMytopicListPage();
      }
    }
    $.router.load(href);
  })

  // $(".strategy-ul").on("click",".strategy-li",function() {
  //   $.showPreloader("正在跳转");
  //   var href = $(this).attr("data-href");
  //   window.location.href = href + "#food";
  // })
  $(".strategy-ul").on("click",".strategy-name",function() {
    $.showPreloader("正在跳转");
    var href = $(this).parent().attr("data-href");
    window.location.href = href + "#food";
  })

  //点击想吃逻辑
  $(".wenwo-ul").on("click", ".down-like", function() {
      //获取点击后的id
      var askId = $(this).parent().parent().attr("data-id");
      var num = $(this).children(".like-num").text();
      //获取是否是已想吃
      if ($(this).hasClass("liked")) {
          //已经是想吃的    取消想吃
          num = parseInt(num) - 1;
          $(this).children(".like-num").text(num);
          $(this).removeClass("liked");
          cancelLike(UserName, askId, this, {
              success: function(result, $_this) {
                  if (result.code == 200) {

                  }else if(result.code == 400){

                  } else {
                      num++;
                      $($_this).children(".like-num").text(num);
                      $($_this).addClass("liked");
                  }
              },
              error: function(error, $_this) {
                  num++;
                  $($_this).children(".like-num").text(num);
                  $($_this).addClass("liked");
              }
          });
      } else {
          //想吃
          num = parseInt(num) + 1;
          $(this).children(".like-num").text(num);
          $(this).addClass("liked");
          like(UserName, askId, this, {
              success: function(result, $_this) {
                  // console.log(result);
                  if (result.code == 200) {}else if(result.code == 400){

                  } else {
                      num--;
                      $($_this).children(".like-num").text(num);
                      $($_this).removeClass("liked");
                  }
              },
              error: function(error, $_this) {
                  // console.log(error);
                  num--;
                  $($_this).children(".like-num").text(num);
                  $($_this).removeClass("liked");
              }
          });
      }
  })

  // $(".wenwo-ul").on("click", ".up-content", function() {
  //     // $.router.load("/detail");
  //     console.log($(this).parent().attr("data-id"));
  //     var askId = $(this).parent().attr("data-id");
  //     $.showPreloader("正在跳转");
  //     // $.router.load("/detail?askid="+askId);
  //     window.location.href = "/detail?askid=" + askId + "#food";
  // })

  // $(".wenwo-ul").on("click", ".up-content", function() {
  //     // $.router.load("/detail");
  //     console.log($(this).parent().attr("data-id"));
  //     var askId = $(this).parent().attr("data-id");

  //     $(".wenwo-ul").on("click", ".ask-reason", function() {
  //       $.showPreloader("正在跳转");
  //       // $.router.load("/detail?askid="+askId);
  //       window.location.href = "/detail?askid=" + askId + "#food";
  //     }) 
  // })

  $(".wenwo-ul").on("click", ".ask-reason", function() {
    //设置cookie
    setCookie("lat",LAT);
    setCookie("lng",LNG);

    $.showPreloader("正在跳转");
    var askId = $(this).parent().parent().parent().attr("data-id");
    // $.router.load("/detail?askid="+askId);
    window.location.href = "/detail?askid=" + askId + "#food";
  })

  $(".wenwo-ul").on("click", ".wenwo-ask-img,.click-hidden-button", function() {
    //设置cookie
    setCookie("lat",LAT);
    setCookie("lng",LNG);

    $.showPreloader("正在跳转");
    if($(this).hasClass("click-hidden-button")){
      var askId = $(this).attr("data-id");
    }else{
      var askId = $(this).parent().attr("data-id");
    }
    
    window.location.href = "/detail?askid=" + askId + "#food";
  })

  $(".wenwo-ul").on("click", ".ask-tag,.down-tag", function() {
    var tag = $(this).text();

    //获取当前页面
    var page = $(".page-current").id;
    if(page == "tag"){
      return ;
    }

    if(tag != $(this).text()){
      $("#tag .wenwo-ul").empty();
      $("#tag .infinite-scroll-preloader .preloader").show();
      $("#tag .ask-end").hide();
    }

    localStorage["askTag"] = tag;

    var tagRange = $("#tag").attr("data-range");
    tagRange = parseInt(tagRange);
    initTagListPage(0,itemsPerLoad,tag,tagRange);

    $.router.load("#tag");
  })

  $(".list-li-like-num").on("click", function() {
      $(".tab-item").removeClass("active");
      $(".like").addClass("active");
      $.router.load("#like");
  })
  $(".list-li-like-share").on("click", function() {
      $.router.load("#share");
  })

  $(".icon-gerenzhongxin").on("click", function() {
      //缓存findPage,buyPage,sharePage
      updatePage("#buy");
      updatePage("#share");
      updatePage("#new");

      $.router.load("#me");
  })
  $("#share .back,#buy .back,#new .back").on("click", function() {
    updatePage("#buy");
    updatePage("#share");
    updatePage("#new");
  })
  $("#tag .back").on("click", function() {
    updatePage("#like");
  })
      // $(".edit").on("click",function(){
      //   $.router.load("/todos/send/test?username=573c1eb271cfe4006c18274f");
      // })

  //初始化个人中心页面
  function initMePage(username) {
      if (localStorage.userHead) {
          // $("#me .pic-bg,#me .user-pic").attr("src", localStorage.userHead);
          $("#me .user-pic").attr("src", localStorage.userHead);
          $("#me .pic-bg").css("background", 'url("'+localStorage.userHead+'") center center / cover no-repeat');

          $("#me .user-name").text(localStorage.userShowName);
          $("#me .list-li-like-num").text(localStorage.foodLikeListCount);
          $("#me .list-li-like-share,#me .my-ask .item-share").text(localStorage.askListCount);
          $("#me .list-li-like-total").text(leaveTwoPoint(localStorage.totalIncome));
          $("#me .itm-buy").text(localStorage.buyListCount);
      }

      if(localStorage.newFood){
        $(".item-content-new").css("display","flex");
      }

      var data = {
          username: username
      }
      $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: "/user/getInfo",
          success: function(result) {
              // console.log(result);
              if (result.code = 200) {
                  var userHead = result.data.userHead;
                  // console.log(userHead);
                  if(userHead == " " || userHead == "/" || !userHead){
                    userHead = "/img/logo.jpg";
                  }
                  var userShowName = result.data.userShowName;
                  var askListCount = result.data.askListCount;
                  var buyListCount = result.data.buyListCount;
                  var totalIncome = leaveTwoPoint(result.data.totalIncome);
                  var foodLikeListCount = result.data.foodLikeListCount;
                  // $("#me .pic-bg,#me .user-pic").attr("src", userHead);
                  $("#me .user-pic").attr("src", userHead);
                  $("#me .pic-bg").css("background", 'url("'+userHead+'") center center / cover no-repeat');
                  $("#me .user-name").text(userShowName);
                  $("#me .list-li-like-num").text(foodLikeListCount);
                  $("#me .list-li-like-share,#me .my-ask .item-share").text(askListCount);
                  $("#me .list-li-like-total").text(totalIncome);
                  $("#me .itm-buy").text(buyListCount);

                  localStorage["userHead"] = userHead;
                  localStorage["userShowName"] = userShowName;
                  localStorage["askListCount"] = askListCount;
                  localStorage["buyListCount"] = buyListCount;
                  localStorage["totalIncome"] = totalIncome;
                  localStorage["foodLikeListCount"] = foodLikeListCount;
              }

          },
          error: function(error) {
              console.log(error);
          },
      })
  }
  initMePage(UserName);

  //初始化购买页面
  function initBuyPage(username) {
      var data = {
          username: username,
          staus: 1
      }
      $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: "/hode/haved",
          success: function(result) {
              if (result.code == 200) {
                  // console.log(result);
                  var html = '';
                  // $("#buy .infinite-scroll-preloader").hide();
                  // $("#buy .want-content").show();
                  // return ;
                  var data = result.askDetail;
                  if (!data.length) {
                      $("#buy .infinite-scroll-preloader").hide();
                      $("#buy .want-content").show();
                  }
                  if (data) {
                      for (var i = 0; i < data.length; i++) {
                          // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum)  + '</label></div>' + '<div class="down-buy" data-id=' + data[i].objectId + '>朕已查阅</div>' + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                        html += formatAsk(data[i]);
                      }
                  }
                  // 添加新条目
                  // 清空列表
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  $('#buy .wenwo-ul').empty();
                  $('#buy .wenwo-ul').append(html);
                  $("#buy .infinite-scroll-preloader .preloader").hide();
                  $("#buy .ask-end").show();

                  initTop();
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
              console.log(error);
          },
      })
  }
  //初始化分享界面
  function initSharePage(username) {
      var data = {
          username: username
      }
      $.ajax({
          type: "GET",
          data: data,
          dataType: "json",
          url: "/ask/myask",
          success: function(result) {
              if (result.code == 200) {
                  // console.log(result);
                  var html = '';
                  var data = result.data;
                  var buyNum = result.buyNum;

                  if (!data.length) {
                      $("#share .infinite-scroll-preloader").hide();
                      $("#share .want-content").show();
                  }
                  if (data) {
                      for (var i = 0; i < data.length; i++) {
                          // html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like-num">有<label class="like-num">'+ data[i].likeNum +'</label>人想吃</div><div class="down-buy-num">有<label class="buy-num">'+buyNum[i].buyNum+'</label>人购买</div><div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                        html += formatAsk(data[i]);
                      }
                  }
                  // console.log(html);
                  // 添加新条目
                  // 清空列表
                  $.pullToRefreshDone('#share .pull-to-refresh-content');
                  $('#share .wenwo-ul').empty();
                  $('#share .wenwo-ul').append(html);
                  $("#share .infinite-scroll-preloader .preloader").hide();
                  $("#share .ask-end").show();
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
              console.log(error);
          },
      })
  }

  // initSharePage(UserName);
  // initBuyPage(UserName);

  //点击购买跳转详情界面
  $(".wenwo-ul").on("click", ".down-buy", function() {
      var askId = $(this).attr("data-id");
      $.showPreloader("正在跳转");
      $.router.load("/detail?askid=" + askId);
  })

  //邀请好友
  $(".item-share").on('click', function() {
      $("#me .modal-overlay-visible").show();
      $("#me .model-share").show();
  })
  $(".modal-in").on('click', function() {
      $("#me .modal-overlay-visible").hide();
      $("#me .modal-in").hide();
  })
  $(".item-message").on("click", function() {
      $.showPreloader("正在跳转");
      $.router.load("http://form.mikecrm.com/Qg7fK7");
  })

  //个人中心提醒
  $(".icon-tixing").on("click", function() {
    $("#me .md-modal").addClass("md-show");
    // $("#me .modal-overlay-visible").show();
    // $("#me .model-tip").show();
  })

  //滚动图链接点击效果
  $(".swiper-container").on("click","#find .swiper-slide",function(){
    $.showPreloader("");
    var href =  $(this).attr("data-href");
    // console.log(href);
    window.location.href = href+"#food";
  })

  var clicked = 0;
  var clickedTimer;
  //彩蛋
  $(".wenwo-logo-content").on("click",function(){
    // console.log(clicked);
    clicked++;
    if(clicked == 5){
      $(".item-content-new").css("display","flex");
      localStorage["newFood"] = 1;
    }
    clearTimeout(clickedTimer);
    clickedTimer = setTimeout(function(){
      clicked = 0;
    }, 500);
  })

  //点击分类跳转
  $("#tagfind,#search").on("click",".tagfind-li,.hot-tag-li",function(){
    var tag = $(this).text();
    if(tag){
      var tagRange = $("#tag").attr("data-range");
      tagRange = parseInt(tagRange);
      localStorage["askTag"] = tag;

      initTagListPage(0,itemsPerLoad,tag,tagRange);
      $("#tag .title").text(tag);
      $.router.load("#tag");
    }
  })

function initCardList(type){
  //初始化卡片界面
  getCardList({size:10,username:UserName},{
    success:function(result){
        // console.log(result);
        var data = result.data;
        var li = '<div class="swiper-hidden">为您精选最美美食</div>';
        for(var i = 0 ; i < data.length; i++){
          if(i == 0){
            $(".card-like-num").text(data[i].likeNum);
            $(".card-down-num").text(data[i].downNum);
          }
          li += '<div class="swiper-slide" data-id="'+data[i].objectId+'" data-askid="'+data[i].askId+'" data-like-num="'+data[i].likeNum+'" data-down-num="'+data[i].downNum+'" data-liked="'+data[i].liked+'"><div class="card-li"><div data-url="'+data[i].cardImg+'" style="background: url('+data[i].cardImg+') center center / cover no-repeat;" class="card-img" alt=""></div><div class="card-detail">'+data[i].detail+'</div><div class="card-by">— —'+data[i].byName+'</div></div></div>';
        }
        $("#card .swiper-wrapper").empty().append(li);
        //调用系统的init方法
        // $("#card .swiper-container").swiper();
        $("#card .infinite-scroll-preloader .preloader").hide();
        // $("#card .ask-end").show();
        // $.reinitSwiper("#card");

        if (type == "refresh") {
          $("#card .swiper-container").swiper();
        } else {
          $.reinitSwiper("#card");
        }

        // $("#card .swiper-container").swiper();

        //初始化卡片数据
        // var cardId = $("#card .swiper-slide-active").attr("data-id");
        // var likeNum = $("#card .swiper-slide-active").attr("data-like-num");
        // var downNum = $("#card .swiper-slide-active").attr("data-down-num");
        // var liked = $("#card .swiper-slide-active").attr("data-liked");
        $(".card-li-footer").attr("data-cardId",data[0].askId);
        $(".card-down-num").text(data[0].downNum);
        $(".card-like-num").text(data[0].likeNum);
        if(data[0].liked == "1"){
          $(".card-like").addClass("card-liked");
        }else{
          $(".card-like").removeClass("card-liked");
        }
    },
    error:function(error){
        console.log(error);
    }
  })
}

  $(".card-look-food").on("click",function(){
    var askid = $("#card .swiper-slide-active").attr("data-askid");
    if(askid){
      window.location.href = "/detail?askid="+askid+"#food";
    }
  })

  //距离选择逻辑
  $("#find .nav-right").on("click",function(){
    if(!$(this).hasClass("range-active")){
      $(".range-content").css("height","4.2rem");
      $(this).addClass("range-active");
      $(".range-content-li").css("visibility", "visible");
    }else{
      $(".range-content").css("height","0rem");
      $(this).removeClass("range-active");
      $(".range-content-li").css("visibility", "hidden");
    }    
  })

  $(".range-content-li").on("click",function(){
    range = $(this).attr("data-range");
    $(".nav-right-range").text($(this).text());
    $(".range-content").css("height","0rem");
    $(".nav-right-range").removeClass("range-active");
    $(".range-content-li").show();
    $(".range-content-li").css("visibility", "hidden");
    $(this).hide();
    // $("#find .wenwo-ul").empty();
    // $("#find .ask-end").hide();
    // $("#find .infinite-scroll-preloader .preloader").show();
    // getAskLoad = 0;
    initFindListPage(range);
  })

  //信息搜索逻辑
  var searchTimer;
  $("#search .keyword").on("input change",function(){
    var keyword = $(this).val().replace(/(^\s*)|(\s*$)/g, "");
    console.log(keyword);
    if(keyword.length > 0){
      // $(".infinite-scroll-preloader").show();
      $("#search .ask-end").hide();
      $("#search .infinite-scroll-preloader .preloader").show();

      $("#search .wenwo-ul-content").hide();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function(){
        if(keyword.length > 0){
          var url = "/ask/skeyword";
          var type = "GET";
          var data = {
            keyword : keyword
          };
          sendQuest(url,type,data,{
            success:function(taglist){
              console.log(taglist);
              var tagLi = '';
              var data = taglist.data;
              for(var i = 0 ; i < data.length; i++){
                tagLi += '<div class="keyword-content-li">'+data[i].tagName+'</div>';
              }
              
              if(data.length > 0){
                $("#search .wenwo-ul-content").hide();
                $(".search-box").hide();
                $(".keyword-content").show().empty().append(tagLi);
              }else{
                $(".search-box").show();
                $(".keyword-content").hide().empty();
              }
            },
            error:function(error){
              console.log(error);
            }
          })
        }
      }, 300);
    }else{
      $("#search .wenwo-ul-content").hide();
      $("#search .wenwo-ul").show();
      $("#search .search-box").show();
      $("#search  .keyword-content").empty();
      clearTimeout(searchTimer);
    }
  })

  $(".search-button").on("click",function(){
    var keyword = $(".keyword").val().replace(/(^\s*)|(\s*$)/g, "");
    if(keyword){
      clearTimeout(searchTimer);
      $("#search .search-box").hide();
      $("#search .ask-end").hide();
      $("#search .infinite-scroll-preloader .preloader").show();

      getSearchLoad = 0;
      $("#search  .keyword-content").empty().hide();
      $("#search  .wenwo-ul").empty();
      $("#search  .wenwo-ul-content").show();
      addItems(itemsPerLoad,0,"search",keyword);
    }
  })

  $("#search  .keyword-content").on("click",".keyword-content-li",function(){
    var keyword = $(this).text();
    console.log(keyword);
    if(keyword){
      clearTimeout(searchTimer);
      $("#search .search-box").hide();
      $("#search .ask-end").hide();
      $("#search .infinite-scroll-preloader .preloader").show();

      getSearchLoad = 0;
      $("#search  .keyword-content").empty().hide();
      $("#search  .wenwo-ul").empty();
      $("#search  .wenwo-ul-content").show();
      addItems(itemsPerLoad,0,"search",keyword);
    }
  })

  $("#search .icon-x").on("click",function(){
    clearTimeout(searchTimer);
    $("#search .keyword").val("");
    $("#search .wenwo-ul-content").hide();
    $("#search .wenwo-ul").empty();
    $("#search .keyword-content").empty().hide();
    $("#search  .search-box").show();
  })

  //点击地址更换信息位置
  $("#find .nav-left,.change-location").on("click",function(){
    if($(this).children(".nav-left-add").text() == "未获取到当前位置"){
      $.showPreloader("正在重新定位");
      window.location.reload();
    }else{
      $("#slocation .wenwo-ul").hide();
      $(".location-box").show();
      $.router.load("#slocation");
      loadLocationList();
    }
  })

  $("#slocation .location").on("input change",function(){
    var text = $("#slocation .location").val().replace(/(^\s*)|(\s*$)/g, "");
    if(text.length){
      AMap.service(['AMap.Autocomplete',"AMap.PlaceSearch"], function() {
        var autoOptions = {
            city: "", //城市，默认全国
       };
       autocomplete= new AMap.Autocomplete(autoOptions);
      //关键字查询
      autocomplete.search(text, function(statu, result) {
          console.log(result);
          console.log(statu);
          var tips = result.tips;
          if(statu == "complete" && tips.length){
            var sug = '';
            for(var i = 0 ; i < tips.length; i++){
              sug +='<div class="auto-item" data-adcode="'+tips[i].adcode+'" data-name="'+tips[i].name+'" id="amap-sug'+i+'">'+tips[i].name+'<span class="auto-item-span">'+tips[i].district+'</span></div>';
            }
            $("#slocation .wenwo-ul").empty().append(sug);
            $("#slocation .wenwo-ul").show();
            $(".location-box").hide();
          } else {
            $(".location-box").hide();
            var noResult = '<div class="no-address"><img src="/img/food/want-empty.svg" class="no-address-img" alt=""><label class="no-result">没有搜索结果</label><label>换个关键词试试</label></div>';
            $("#slocation .wenwo-ul").empty().append(noResult);
            $("#slocation .wenwo-ul").show();
          }
          var text = $("#slocation .location").val();
          if(!text.length){
            $("#slocation .wenwo-ul").hide();
            $(".location-box").show();
          }
        });
      });
    }else{
      $("#slocation .wenwo-ul").empty().hide();;
      $(".location-box").show();
    }
  })

  //点击搜素按钮
  // $("#slocation .search-button").on("click", function() {
  $("#slocation").on("click", ".auto-item", function() {
    var text = $(this).attr("data-name");
    var adcode = $(this).attr("data-adcode");
    console.log(text);
    if(!text){
      return;
    }
    AMap.service(["AMap.PlaceSearch"], function() {
      var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
        city:adcode,
        map: map
      });
    //关键字查询
    placeSearch.search(text, function(statu, result) {
        console.log(result);
        if (result.info == "OK") {
          var lng = result.poiList.pois[0].location.lng;
          var lat = result.poiList.pois[0].location.lat;
          var lnglatXY = [lng, lat];

          console.log(lnglatXY);

          if(lng && lat){
            LNG = lng;
            LAT = lat;
            $("#find .wenwo-ul").empty();
            $("#slocation .location").val("");

            $("#find .infinite-scroll-preloader .preloader").show();
            $("#find .ask-end").hide();
            getAskLoad = 0;
            addItems(itemsPerLoad, 0,"find");
            $.router.load("#find",false,"left");
            $(".nav-left-add").text(text);   
          }
        }
      });
    });
  });

  $("#slocation .cancel-button").on("click", function() {
    $(".location").val("");
    $("#slocation .wenwo-ul").empty().hide();;
    $(".location-box").show();
  });

  //点击热门地址
  $(".hot-location-content").on("click",".hot-location-content-li",function(){
    var address = $(this).text();
    $(".nav-left-add").text(address);
    LAT = $(this).attr("data-lat");
    LNG = $(this).attr("data-lng");

    $("#find .wenwo-ul").empty();
    $("#slocation .location").val("");

    console.log("123");

    $("#find .ask-end").hide();
    $("#find .infinite-scroll-preloader .preloader").show();
    getAskLoad = 0;
    addItems(itemsPerLoad, 0,"find");
    $.router.load("#find",false,"left");
    $(".nav-left-add").text(address);
  })

  
  $(".my-location-content").on("click",function(){
    LNG = $(".my-location-content").attr("data-lng");
    LAT = $(".my-location-content").attr("data-lat");

    $("#find .wenwo-ul").empty();
    $("#slocation .location").val("");
    $("#find .ask-end").hide();
    $("#find .infinite-scroll-preloader .preloader").show();
    getAskLoad = 0;
    addItems(itemsPerLoad, 0,"find");
    $.router.load("#find",false,"left");
    $(".nav-left-add").text($(".location-detail").text());
  })

  $(".down-img-dialog").on("click",function(){
    $(this).hide();
  })

  var tagTimer;
  $("#tag .change-sort").on("click",function(){
    clearTimeout(tagTimer);

    var tagRange = $(this).attr("data-range");
    $("#tag").attr("data-range",tagRange);
    localStorage["tagRange"] = tagRange;

    if(tagRange > 0){
      $("#tag .change-sort label").text("距离");
      $(this).attr("data-range", -1);
    }else{
      $("#tag .change-sort label").text("评分");
      $(this).attr("data-range", 3000000);
    }
    $("#tag .wenwo-ul").empty();
    $("#tag .ask-end").hide();

    tagTimer = setTimeout(function(){
      $("#tag .infinite-scroll-preloader .preloader").css("display", "inline-block");
      getTagLoad = 0;
      addItems(itemsPerLoad, 0,"tag");
    }, 500);
  })

  var likeTimer;
  $("#like .change-sort").on("click",function(){
    // if(!$("#like .wenwo-li").length){
    //   return;
    // }
    clearTimeout(tagTimer);
    var tagRange = $(this).attr("data-range");
    $("#like").attr("data-range",tagRange);
    localStorage["likeRange"] = tagRange;

    if(tagRange > 0){
      $("#like .change-sort label").text("距离");
      $(this).attr("data-range", -1);

    }else{
      $("#like .change-sort label").text("时间");
      $(this).attr("data-range", 3000000);
    }

    $("#like .wenwo-ul").empty();
    $("#like .ask-end").hide();

    likeTimer = setTimeout(function(){
      $("#like .infinite-scroll-preloader .preloader").css("display", "inline-block");
      getLikeLoad = 0;
      addItems(itemsPerLoad, 0,"like");
    }, 500);
  })

  var strategyTimer;
  // var $_strategyLikeBtn;
  $("#strategy").on("click",".strategy-like-btn",function(){
    clearTimeout(strategyTimer);
    var carouselid = $(this).parent().attr("data-id");
    var liked = $(this).attr("data-liked");
    liked = parseInt(liked);

    var $_strategyLikeBtn = $(this);
    
    var likeNum = $(this).children(".strategy-like-num").text();
    console.log(likeNum);

    if($(this).hasClass("strategy-liked")){
      $(this).removeClass("strategy-liked");
      $(this).children(".strategy-like-num").text(parseInt(likeNum) - 1);

      $(this).children(".strategy-like").css({
        "animation": "strategy .5s ease-in-out both",
        "-webkit-animation": "strategy .5s ease-in-out both",
        "-o-animation": "strategy .5s ease-in-out both"
      });
    }else{
      $(this).addClass("strategy-liked");
      $(this).children(".strategy-like-num").text(parseInt(likeNum) + 1);

      $(this).children(".strategy-like").css({
        "animation": "strategy2 .5s ease-in-out both",
        "-webkit-animation": "strategy2 .5s ease-in-out both",
        "-o-animation": "strategy2 .5s ease-in-out both"
      });
    }

    strategyTimer = setTimeout(function(){

      if(!$_strategyLikeBtn.hasClass("strategy-liked") && liked){
        //取消想吃
        console.log("取消想吃");
        var data = {
          username        : UserName,
          carousel_id     : carouselid
        }
        $.ajax({
          type : "POST",
          data: data,
          dataType: "json",
          url : "/carousel/canceltopiclike",
          success: function(result){
            if(result.code == 200){
              $_strategyLikeBtn.attr("data-liked",0);
              clearTimeout(strategyTimer);
            }else{
              $.toast("重复操作");
            } 
          },
          error:function(error){
            $.toast("服务器出错");
          },
        })
      }
      console.log($(this));
      if($_strategyLikeBtn.hasClass("strategy-liked") && !liked){
        //想吃
        console.log("想吃");
        var data = {
          username        : UserName,
          carousel_id     : carouselid
        }
        $.ajax({
          type : "POST",
          data: data,
          dataType: "json",
          url : "/carousel/topiclike",
          success: function(result){
            if(result.code == 200){
              $_strategyLikeBtn.attr("data-liked",1);
              clearTimeout(strategyTimer);
            }else{
              $.toast("重复操作");
            } 
          },
          error:function(error){
            $.toast("服务器出错");
          },
        })
      }

    }, 300);
  })

  $("#mytopic").on("click",".strategy-like-btn",function(){
    var carouselid = $(this).parent().attr("data-id");
    $(this).parent().parent().css("height","0rem");
    $(this).parent().parent().css("opacity","0");
    console.log($(".mytopic .strategy-li").length);
    if($("#mytopic .strategy-li").length == 1){
      $("#mytopic .want-content").show();
    }
    var data = {
      username        : UserName,
      carousel_id     : carouselid
    }
    $.ajax({
      type : "POST",
      data: data,
      dataType: "json",
      url : "/carousel/canceltopiclike",
      success: function(result){
      },
      error:function(error){
        $.toast("服务器出错");
      },
    })
  })

}
