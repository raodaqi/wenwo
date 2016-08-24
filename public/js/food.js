  //下拉刷新
  var map = '',
      LAT,
      LNG,
      title1 = 1,
      title2 = 1,
      title3 = 1,
      title4 = 1;
  //测试
  LAT = 30.580596;
  LNG = 103.982984;

  // window.onpopstate = function(event) {
  //   alert($(".page-current").id);
  //   // $(".amap-sug-result").hide(); 
  // };

  $.showPreloader("正在加载");

  initLocation("food",{
      success: function(lng, lat) {
          LAT = lat;
          LNG = lng;
          // addItems(itemsPerLoad, 0,"find");
          var findTop = localStorage.findTop;
          if(findTop > 2077){
            addItems(40, 0,"find");
          }else{
            addItems(itemsPerLoad, 0,"find");
          }
      },
      error: function(error) {
          console.log(error);
      }
  });
  
  //初始化轮播图功能
  function sendCarouseQuest(url,type,data,callback){
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
  function getCarouselInfo(callback){
    var url = "/carousel/getcarouselinfo",
        type = "GET",
        data = {};
    sendCarouseQuest(url,type,data,{
        success:function(result){
            callback.success(result);
        },
        error:function(error){
            callback.error(error);
        }
    })
  }
  getCarouselInfo({
    success:function(result){
        console.log(result);
        var data = result.data;
        var li = '';
        for(var i = 0 ; i < data.length; i++){
            li += '<div class="swiper-slide" data-href="'+data[i].carouselClickURL+'"><img src="'+data[i].carouselImage+'" alt=""></div>';
        }
        $(".swiper-wrapper").empty().append(li);
        //调用系统的init方法
        sw.init();
    },
    error:function(error){
        console.log(error);
    }
  })

  // 添加'refresh'监听器
  $(document).on('refresh', '.pull-to-refresh-content', function(e) {
      // 刷新主页
      // 获取当前是所在页面
      var id = $(this).parent()[0].id;
      title1 = 1;
      title2 = 1;
      title3 = 1;
      title4 = 1;
      console.log(id);
      switch (id) {
          case "find":
              initFindListPage();
              break;
          case "like":
              $(".want-content").hide();
              initLikeListPage();
              break;
          case "share":
              initSharePage(UserName);
              break;
          case "buy":
              initBuyPage(UserName);
              break;
          case "new":
              initNewListPage(0,20);
              break;
          default:
              setTimeout(function() {
                  $.pullToRefreshDone('.pull-to-refresh-content');
              }, 1000);
              break;
      }
  });

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
              console.log(result);
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

  //初始化主页链接
  function init() {
      var url = window.location.hash;
      if (url) {
          url = url.split("#")[1];
      } else {
          url = "find";
      }
      console.log(url);
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
              // initSharePage(UserName);
              // initBuyPage(UserName);
              break;
          case "me":
              initSharePage(UserName);
              initBuyPage(UserName);
              initNewListPage(0,20);
              break;
          case "new":
              var findTop = localStorage.findTop;
              if(findTop > 2077){
                addItems(40, 0,"new");
              }else{
                addItems(20, 0,"new");
              }
              break;
      }
  }

  function updatePage(type) {
      switch (type) {
          case "#share":
              initSharePage(UserName);
              break;
          case "#buy":
              initBuyPage(UserName);
              break;
          case "#like":
              initLikeListPage();
              break;
          case "#me":
              initMePage(UserName);
              break;
          case "#new":
              initNewListPage(0,20);
              break;
      }
  }

  //获取美食信息
  function getAskMe(page, size, staus, username,type, callback) {
      var staus = staus ? staus : 1;
      var username = username ? username : '';
      if (LAT && type != "new") {
          var data = {
              page: page,
              size: size,
              staus: staus,
              position_geo: LAT + "," + LNG,
              username: username
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
              // console.log(result);
              // var data = result.data;
              // for(var i = 0; i < data.length; i++){
              //   var lat1 = parseFloat(data[i].GeoX);
              //   var lng1 = parseFloat(data[i].GeoY);
              //   var long1  = getFlatternDistance(lat1,lng1,LAT,LNG);
              //   console.log(long1);
              // }
              callback.success(result);
          },
          error: function(error) {
              // console.log(error);
              callback.error(error);
          },
      })
  }

  var timer = '';
  //双击头部返回头部
  $(".bar").on("doubleTap", function() {
      var scroolTime = 1;
      var scroolSppeed = $("#find .wenwo-ul").height() / 100;
      timer = setInterval(function() {
          var height = $("#find .find-content").scrollTop();
          if (height <= 0) {
              $("#find .find-content").scrollTop(0);
              clearInterval(timer);
          } else {
              height = height - scroolSppeed;
              $("#find .find-content").scrollTop(height);
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
    var findTop = $("#find .find-content").scrollTop();
    var likeTop = $("#like .like-content").scrollTop();
    var shareTop = $("#share .share-content").scrollTop();
    var buyTop = $("#buy .buy-content").scrollTop();

    localStorage["findTop"] = findTop;
    localStorage["likeTop"] = likeTop;
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
  function getLikeList(username, callback) {
      var username = username ? username : '';
      var data = {
          username: username
      }
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

//封装滚动加载模块

  // function initData(){
  // 加载flag
  var loading = false;
  // 最多可加载的条目
  // var maxItems = 100;

  // 每次加载添加多少条目
  var itemsPerLoad = 20;

  //getAskLoad getNewLoad  0代表空闲 1代表占用
  var getAskLoad = 0;
  var getNewLoad = 0;

  function addItems(number, lastIndex,type) {

      //屏蔽其他请求
      // console.log(lastIndex);
      var page = parseInt(lastIndex / number);
      if(!getNewLoad){
        if(type == "new"){
          getNewLoad = 1;
          initNewListPage(page, number);
        }
      }

      if (!getAskLoad) {
        if(type == "find"){
          getAskLoad = 1;
          getAskMe(page, number, '', UserName,'', {
              success: function(result) {
                  // 生成新条目的HTML
                  var html = '';
                  var data = result.data;
                  if (data) {
                      for (var i = 0; i < data.length; i++) {
                          var lat1 = data[i].GeoX;
                          var lng1 = data[i].GeoY;
                          var long = getFlatternDistance(lat1, lng1, LAT, LNG);
                          if (long < 500) {

                              // title = '<div class="distance">距离 < 1KM</div>';

                              if (title1) {
                                  html += '<div class="title1 distance">距离 < 500M</div>';
                                  title1 = 0;
                              }

                          } else if (long >= 500 && long <= 2000) {

                              if (title2) {
                                  html += '<div class="title2 distance">距离500M - 2KM</div>';
                                  title2 = 0;
                              }

                          }else if (long >= 2000 && long <= 10000) {

                              if (title3) {
                                  html += '<div class="title3 distance">距离2KM - 10KM</div>';
                                  title3 = 0;
                              }

                          } else {
                              if (title4) {
                                  html += '<div class="title4 distance">距离 > 10KM</div>';
                                  title4 = 0;
                              }
                          }

                          html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatDis(formatJSON(data[i].askPosition),long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
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


  //预先加载20条
  // if (LAT) {
  //   var findTop = localStorage.findTop;
  //   if(findTop > 2077){
  //     addItems(40, 0,"find");
  //   }else{
  //     addItems(itemsPerLoad, 0,"find");
  //   }
  // }

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

  // }
  // initData();
  // getAskMe(2,10);

  $.init();
  init();

  //初始化主页列表
  function initFindListPage() {
      //初始化主页列表，获取前20条信息
      // $('#find .wenwo-ul').empty();
      // addItems(20, 0);
      // return;
      getAskMe(0, 20, '', UserName,'', {
          success: function(result) {
              // 生成新条目的HTML
              var html = '';
              var data = result.data;

              if (data) {
                  for (var i = 0; i < data.length; i++) {

                      var lat1 = data[i].GeoX;
                      var lng1 = data[i].GeoY;
                      var long = getFlatternDistance(lat1, lng1, LAT, LNG);
                       if (long < 500) {

                              if (title1) {
                                  html += '<div class="title1 distance">距离 < 500M</div>';
                                  title1 = 0;
                              }

                          } else if (long >= 500 && long <= 2000) {

                              if (title2) {
                                  html += '<div class="title2 distance">距离500M - 2KM</div>';
                                  title2 = 0;
                              }

                          }else if (long >= 500 && long <= 2000) {

                              if (title3) {
                                  html += '<div class="title3 distance">距离2KM - 10KM</div>';
                                  title3 = 0;
                              }

                          } else {
                              if (title4) {
                                  html += '<div class="title4 distance">距离 > 10KM</div>';
                                  title4 = 0;
                              }
                          }

                          html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatDis(formatJSON(data[i].askPosition),long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
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
  function initNewListPage(page, number) {
      //初始化最新列表，获取前20条信息
      getAskMe(page, number, '', UserName,'new', {
          success: function(result) {
              // 生成新条目的HTML
              var html = '';
              var data = result.data;
              if (data) {
                  for (var i = 0; i < data.length; i++) {

                      var lat1 = data[i].GeoX;
                      var lng1 = data[i].GeoY;
                      var long = getFlatternDistance(lat1, lng1, LAT, LNG);
                      //  if (long < 500) {

                      //         if (title1) {
                      //             html += '<div class="title1 distance">距离 < 500M</div>';
                      //             title1 = 0;
                      //         }

                      //     } else if (long >= 500 && long <= 2000) {

                      //         if (title2) {
                      //             html += '<div class="title2 distance">距离500M - 2KM</div>';
                      //             title2 = 0;
                      //         }

                      //     }else if (long >= 500 && long <= 2000) {

                      //         if (title3) {
                      //             html += '<div class="title3 distance">距离2KM - 10KM</div>';
                      //             title3 = 0;
                      //         }

                      //     } else {
                      //         if (title4) {
                      //             html += '<div class="title4 distance">距离 > 10KM</div>';
                      //             title4 = 0;
                      //         }
                      //     }

                      html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-add">'+formatDis(formatJSON(data[i].askPosition),long)+'</div><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                  }
                  // 添加新条目
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  if(page == 0){
                    $('#new .wenwo-ul').empty();
                  }
                  
                  $('#new .wenwo-ul').append(html);

                  initTop();

                  //初始化滚动加载逻辑
                  $.attachInfiniteScroll($('#find .infinite-scroll'));
                  // 删除加载提示符
                  // $('.infinite-scroll-preloader').remove();
                  $("#new .ask-end").hide();
                  $("#new .infinite-scroll-preloader .preloader").css("display", "inline-block");
                  getNewLoad = 0;
                  if (number > data.length) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    $.detachInfiniteScroll($('#new .infinite-scroll'));
                    // 删除加载提示符
                    // $('.infinite-scroll-preloader').remove();
                    $("#new .infinite-scroll-preloader .preloader").hide();
                    $("#new .ask-end").show();
                    // $('.infinite-scroll-preloader').append("")
                    getNewLoad = 1;
                    return;
                }
              }else{
                $.detachInfiniteScroll($('#new .infinite-scroll'));
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

  //初始化想吃列表
  function initLikeListPage() {
      //获取想吃列表
      getLikeList(UserName, {
          success: function(result) {
              if (result.code == 200) {
                  var html = '';
                  var data = result.askDetail;
                  if (!data.length) {
                      $("#like .infinite-scroll-preloader").hide();
                      $("#like .want-content").show();
                  }
                  if (data) {
                      for (var i = 0; i < data.length; i++) {
                          html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like liked"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum) + '</label></div>' + (data[i].score > 9 ? '<div class="down-buy" data-id=' + data[i].objectId + '>' + formatPrice(data[i].askPrice) + '</div>' : '<div class="down-buy free" data-id=' + data[i].objectId + '>限时免费</div>') + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                      }
                  }
                  // 添加新条目
                  //清空原来的数据
                  $.pullToRefreshDone('.pull-to-refresh-content');
                  $('#like .wenwo-ul').empty();
                  $('#like .wenwo-ul').append(html);
                  $("#like .infinite-scroll-preloader .preloader").hide();
                  $("#like .ask-end").show();

                  initTop();
              }
          },
          error: function(error) {
              $.pullToRefreshDone('.pull-to-refresh-content');
          }
      })
  }
  initLikeListPage();

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
          $.router.load("#like");

          setTimeout(function() {
              $(".pull-to-refresh-arrow").show();
          }, 500);
      } else if (type == "find") {
          //缓存个人中心列表，想吃列表
          $(".pull-to-refresh-arrow").hide();
          updatePage("#me");
          updatePage("#like");
          $.router.load("#find");

          setTimeout(function() {
              $(".pull-to-refresh-arrow").show();
          }, 500);
      } else if (type == "edit") {
          // $.router.load("/edit");
          $.showPreloader("正在跳转");
          window.location.href = "/edit";
      }
  })

  // $(".edit").on("click",function(){
  //   $.showPreloader("正在跳转");
  //   window.location.href="/edit";
  // })
  $(".empty-button").on("click", function() {
      var href = $(this).attr("data-href");
      if (href.split("#")[1]) {
          $(".tab-item").removeClass("active");
          $(".find").addClass("active");
          $.router.load(href);
      } else {
          $.showPreloader("正在跳转");
          $.router.load(href);
      }
  });
  $(".my-ask .item-link").on("click", function() {
      var href = $(this).attr("data-href");
      $.router.load(href);
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
                  console.log(result);
                  if (result.code == 200) {} else {
                      num--;
                      $($_this).children(".like-num").text(num);
                      $($_this).removeClass("liked");
                  }
              },
              error: function(error, $_this) {
                  console.log(error);
                  num--;
                  $($_this).children(".like-num").text(num);
                  $($_this).removeClass("liked");
              }
          });
      }
  })

  $(".wenwo-ul").on("click", ".up-content", function() {
      // $.router.load("/detail");
      console.log($(this).parent().attr("data-id"));
      var askId = $(this).parent().attr("data-id");
      $.showPreloader("正在跳转");
      // $.router.load("/detail?askid="+askId);
      window.location.href = "/detail?askid=" + askId + "#food";
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
              console.log(result);
              if (result.code = 200) {
                  var userHead = result.data.userHead;
                  console.log(userHead);
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
                  console.log(result);
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
                          html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like ' + (data[i].liked ? "liked" : '') + '"><span class="icon iconfont icon-likeEat"></span><label class="like-num">' + (data[i].likeNum < 0 ? 0 : data[i].likeNum)  + '</label></div>' + '<div class="down-buy" data-id=' + data[i].objectId + '>朕已查阅</div>' + '<div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
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
                  console.log(result);
                  var html = '';
                  var data = result.data;
                  var buyNum = result.buyNum;

                  if (!data.length) {
                      $("#share .infinite-scroll-preloader").hide();
                      $("#share .want-content").show();
                  }
                  if (data) {
                      for (var i = 0; i < data.length; i++) {
                          html += '<div class="wenwo-li" data-id=' + data[i].objectId + '><div class="up-content"><img src="' + data[i].createByUrl + '" alt="" class="user-pic"><div class="ask-content"><div class="ask-tag">' + formatTag(data[i].askTagStr) + '</div><div class="ask-reason">' + data[i].askReason + '</div></div></div><div class="down-content"><div class="down-like-num">有<label class="like-num">'+ data[i].likeNum +'</label>人想吃</div><div class="down-buy-num">有<label class="buy-num">'+buyNum[i].buyNum+'</label>人购买</div><div class="down-time">' + formatDate("y.m.d", data[i].createdAt) + '</div></div></div>';
                      }
                  }
                  console.log(html);
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
      $("#me .modal-overlay-visible").show();
      $("#me .model-tip").show();
  })

  //滚动图链接点击效果
  $(".swiper-container").on("click",".swiper-slide",function(){
    var href =  $(this).attr("data-href");
    console.log(href);
    window.location.href = href+"#food";
  })

  var clicked = 0;
  var clickedTimer;
  //彩蛋
  $(".wenwo-logo-content").on("click",function(){
    console.log(clicked);
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
