  //初始化分享
  onlyInitShare();
  //页面加载执行
  // $(function(){

  //浏览人数添加
  function addLook(AskId,callback){
    $.ajax({
      type: "POST",
      url: "/ask/addLook",
      data: {ask_id:AskId},
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

  console.log(UserName);
  if (AskId) {
      getAskDetail(AskId, UserName);
      addLook(AskId,{
        success:function(result){
          console.log(result);
        },
        error:function(error){
          console.log(error);
        }
      });
  }

  window.onpopstate = function(event) {
    var url = window.location.hash;
    if (url.split("#")[1] != "food") {
      window.location.href = "/newfood";
    } 
    
  };

  function init() {
      var url = window.location.hash;
      if (url.split("#")[1]) {
          URL = "food";
      }

      if(history.length < 2 && url.split("#")[1] != "food"){
        var json={time:new Date().getTime()};
        // @状态对象：记录历史记录点的额外对象，可以为空
        // @页面标题：目前所有浏览器都不支持
        // @可选的url：浏览器不会检查url是否存在，只改变url，url必须同域，不能跨域
        window.history.pushState(json,"","/newfood");
      }
  }

  $("#delete #reason").focus(function(){
    $("#delete").addClass("focus");
  })

  $("#delete #reason").blur(function(){
    $("#delete").removeClass("focus");
  })

  function getAskDetail(askid, username) {
      var username = username ? username : '';
      var data = {
          username: username,
          ask_id: askid
      }
      $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: "/ask/askdetail",
          success: function(result) {
              console.log(result);
              if (result.code == 200) {
                  var data = result.data;
                  $("#detail .title").text(formatTag(data.askTagStr));
                  // $(".username").text(data.createByName);
                  $(".username").html(data.createByName+'<span class="wenwo-color">学姐</span>');
                  likeNum = data.likeNum < 0 ? 0 : data.likeNum;
                  $(".like-num").text(likeNum);

                  //初始化分享
                  WX_SHARE_LINK = "http://www.wenwobei.com/detail?askid=" + data.objectId;
                  WX_SHARE_IMGURL = data.createByUrl;
                  WX_SHARE_TITLE = data.askReason;
                  console.log(WX_SHARE_TITLE);
                  var askTagStr = data.askTagStr;
                  askTagStr = JSON.parse(askTagStr);
                  tag = askTagStr[0].tag_name;

                  WX_SHARE_DESC = data.createByName + " : 分享了「" + tag + "」美食,瞅瞅波？"
                  initShare();

                  //判断是否是限时免费
                  if (data.score < 20) {
                      $(".buy").text("限时免费");
                      $(".buy").addClass("free");
                  }

                  //判断是否有会员卡
                  if(data.vipCardImage && data.vipCardContent){
                    // $(".card-tip").show();
                    $(".card-content .tag-img").attr("src",data.vipCardImage);
                    var content = data.vipCardContent.replace(/\r/ig, "").replace(/\n/ig, "<br/>");
                    var contentArray = content.split("<br/>");
                    $(".content-box").html(content);
                    var contentLength = 0;
                    for(var i = 0; i < contentArray.length; i++){
                      if(contentArray[i]){
                        contentLength++;
                      }
                    }
                    var top = 35 - 5*contentLength;
                    var width = $(window).width();
                    var cardWidth = width > 500 ? 500 : width * 0.95;
                    var cardHeight = cardWidth / 1.52;
                    $(".content-box").css({
                      'top': top+"%",
                    })
                  }

                  var price = parseFloat(data.askPrice);
                  if(price == 0 || price == "0.0"){
                    $(".buy").text("免费瞅瞅");
                  }

                  //判断是否想吃过
                  if (result.show.foodLikeFlag) {
                      //想吃过
                      $(".like").addClass("liked");
                  } else {
                      //没有想吃过
                      $(".like").removeClass("liked");
                  }

                  //显示已售数量
                  if(result.show.havedNum){
                    if(result.data.buyNum != "0"){
                      $(".sale-num").text(result.data.buyNum);
                    }else{
                      $(".sale-num").text(result.show.havedNum);
                    }
                    
                  }
                  

                  //判断是否是自己的信息
                  if (result.show.isOwnFlag) {
                      //是自己的
                      $(".buy").text("朕分享的");
                      $(".buy").attr("data-buy", "1");
                      $(".pull-right").show();
                  }

                  //判断是否买过
                  if (result.show.havedFlag) {
                      //买过
                      $(".buy").text("朕已查阅");
                      $(".buy").attr("data-buy", "1");
                      $(".buyed-img").show();
                      $(".dislike-content").show();
                  }

                  //判断是否被用户删除
                  var staus = data.staus;
                  console.log(staus);
                  if(staus == "6"){
                    $(".like").hide();
                    $(".buy").hide();
                    $(".username-content").css("bottom","1rem");
                    $(".askDefault").text("该商品已下架，下架原因："+data.askDefault);
                    $(".askDefault").show();
                    $(".pull-right").hide();
                  }

                  if (result.show.havedFlag || result.show.isOwnFlag || result.data.isHavedAccount == 1) {
                      //显示店名，地址
                      if (data.shopName) {
                          $(".detail-rtname").text(data.shopName);
                      } else {
                          $(".detail-rtname").text("暂无");
                      }
                      if (data.askPosition) {
                          var askPosition = JSON.parse(data.askPosition);
                          var address = '';
                          for (var key in askPosition) {
                              console.log(askPosition[key]);
                              if(key == "adetail" && askPosition[key]){
                                address += "（";
                              }
                              address += askPosition[key];
                              if(key == "adetail" && askPosition[key]){
                                address += "）";
                              }
                          }
                          $(".detail-address").text(address);
                          $(".detail-address,.detail-rtname").attr("data-GeoX", data.GeoX);
                          $(".detail-address,.detail-rtname").attr("data-GeoY", data.GeoY);
                      }
                  }

                  $(".price").text(data.askPrice);
                  // $(".pic-bg").attr("src", data.createByUrl);
                  $(".pic-bg").css("background", 'url("'+data.createByUrl+'") center center / cover no-repeat');

                  var askImage = data.askImage;
                  if(askImage){
                    askImage = JSON.parse(askImage);
                    if(askImage[0].image){
                      $(".pic-bg").css("background", 'url("'+askImage["0"].image+'") center center / cover no-repeat');
                      $(".bg-mask").hide();
                    }
                  }

                  $(".detail-reason").text(data.askReason);
                  // $(".detail-rtname").text(data.shopName);
                  //解析美食详情
                  var contentShow = data.askContentShow;
                  if (contentShow) {
                      //判断是否是标准json格式
                      if (contentShow.indexOf("{") == -1 || contentShow.indexOf("}") == -1 || contentShow.indexOf(":") == -1) {
                          $(".detail-content").text(contentShow);
                      } else {
                          contentShow = JSON.parse(contentShow);
                          console.log(contentShow);
                          if (contentShow.detail || contentShow.detailLi) {
                              if (contentShow.detail) {
                                var detail = contentShow.detail.replace(/\r/ig, "").replace(/\n/ig, "<br/>");
                                $(".edit-detail").html(detail);
                              }
                              if (contentShow.detailLi) {
                                  console.log(contentShow.detailLi);

                                  if(contentShow.detailLi[0].name){
                                    var detailLi = contentShow.detailLi;
                                  }else{
                                    var detailLi = contentShow.detailLi;
                                    detailLi = JSON.parse(detailLi);
                                  }
                                  
                                  $(".edit-detail-li-content").empty();
                                  for (var i = 0; i < detailLi.length; i++) {
                                      //初始化显示界面
                                      var li = '<div class="edit-detail-li"><div class="edit-detail-li-title">' + detailLi[i].name + '</div><div class="edit-detail-li-input">' + detailLi[i].val + '</div></div>';
                                      $(".edit-detail-li-content").append(li);
                                  }
                              }
                          }
                      }
                  }


                  $(".preloader-modal").hide();
                  $("#detail").show();
              } else {
                  $(".preloader-modal").hide();
                  $("body").empty();
                  var error = '<div class="error-content content pull-to-refresh-content" data-ptr-distance="55"><div class="pull-to-refresh-layer"><div class="preloader"></div><div class="pull-to-refresh-arrow"></div></div><div class="card-container no-user">' + result.message + '</div></div>';
                  $("body").append(error);
              }
              // callback.success(result);
          },
          error: function(error) {
              console.log(error);
              $(".preloader-modal").hide();
              $("body").empty();
              var error = '<div class="error-content content pull-to-refresh-content" data-ptr-distance="55"><div class="pull-to-refresh-layer"><div class="preloader"></div><div class="pull-to-refresh-arrow"></div></div><div class="card-container no-user">服务器出错</div></div>';
              $("body").append(error);
              // callback.error(error);
          },
      })
  }

  init();

  $(".tab-item").on("click", function() {
      // console.log($());
      var type = $(this).attr("data-type");
      console.log(type);
      $(".tab-item").removeClass("active");
      $(this).addClass("active");
      if (type == "like") {
          $.router.load("#like");
      } else if (type == "find") {
          $.router.load("#find");
          // $.router.back();
      } else if (type == "edit") {
          $.router.load("/edit?username=573c1eb271cfe4006c18274f");
      }
  })

  //点击更多的逻辑
  $(".icon-more").on("click",function(){
    $(".more-dialog").show();
  })
  $(".more-dialog .modal-overlay").on("click",function(){
    $(".more-dialog").hide();
  })
  $(".more-edit").on("click",function(){
    $.showPreloader("正在加载");
    window.location.href = "/edit?type=edit&askid="+AskId;
  })
  //点击删除下架
  $(".more-delete").on("click",function(){
    $(".more-dialog").hide();
    $.router.load("#delete");
  })
  //点击确认下架
  $("#delete .delete-btn").on("click",function(){
    var reason = $("#delete #reason").val();
    if(!reason || reason == " "){
      $.toast("下架理由不能为空");
      return;
    }else{
      if(!AskId || !UserName){
        $.toast("下架失败");
        return;
      }
      $.showPreloader("正在下架");
      var data = {
          username: UserName,
          ask_id: AskId,
          reason: reason
      }
      $.ajax({
        type: "POST",
        data: data,
        dataType: "json",
        url: "/ask/del",
        success: function(result) {
          console.log(result);
          $.hidePreloader();
          if(result.code == 200){
            $.toast("下架成功");
            var reason = $("#delete #reason").val();
            $(".like").hide();
            $(".buy").hide();
            $(".username-content").css("bottom","1rem");
            $(".askDefault").text("该商品已下架，下架原因："+reason);
            $(".askDefault").show();
            $(".pull-right").hide();
            $.router.back();
          }else if(result.code == 700){
            $.toast("重复下架");
          }else if(result.code == 800){
            $.toast("不是您的信息");
          }else{
            $.toast("下架失败");
          }
        },
        error:function(error){
          $.toast("服务器异常");
          $.hidePreloader();
          console.log(error);
        }
      })
    }
  })

  //点击返回逻辑bug
  $("#detail .icon-left").on("click", function() {
      $.showPreloader("正在跳转");
      // window.location.href="/edit";
      if (URL == "food") {
          history.back();
      } else {
          window.location.href = "/newfood";
      }
  })

  //点击地址跳转地图
  $(".detail-address,.detail-rtname").on("click", function() {
      var lat = $(this).attr("data-geox");
      var lng = $(this).attr("data-geoy");
      if (lat && lng) {
        $.showPreloader("正在跳转");
        window.location.href = "/map?lat=" + lat + "&lng=" + lng;
      }
  })

  // $(".edit").on("click",function(){
  //   $.router.load("/todos/send/test?username=573c1eb271cfe4006c18274f");
  // })

  //点击想吃逻辑
  $(".content").on("click", ".like", function() {
      //获取点击后的id
      var askId = AskId;

      var num = $(".like-num").text();
      //获取是否是已想吃
      console.log($("liked"));
      if ($(this).hasClass("liked")) {
          //已经是想吃的    取消想吃
          num = parseInt(num) - 1;
          $(".like-num").text(num);
          $(this).removeClass("liked");
          cancelLike(UserName, askId, '', {
              success: function(result) {
                  console.log(result);
                  if (result.code == 200) {

                  }else if(result.code == 400){

                  } else {
                      num++;
                      $(".like-num").text(num);
                      $(".like").addClass("liked");
                  }
              },
              error: function(error) {
                  console.log(error);
                  num++;
                  $(".like-num").text(num);
                  $(".like").addClass("liked");
              }
          });
      } else {
          //想吃
          num = parseInt(num) + 1;
          $(".like-num").text(num);
          $(this).addClass("liked");
          like(UserName, askId, '', {
              success: function(result) {
                  console.log(result);
                  if (result.code == 200) {}else if(result.code == 400){

                  } else {
                      num--;
                      $(".like-num").text(num);
                      $(".like").removeClass("liked");
                  }
              },
              error: function(error) {
                  console.log(error);
                  num--;
                  $(".like-num").text(num);
                  $(".like").removeClass("liked");
              }
          });
      }
  })

  function getHide(callback) {
      var data = {
          username: UserName,
          ask_id: AskId
      }
      $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: "/ask/askdetail",
          success: function(result) {
              console.log(result);
              if (result.code == 200) {
                  callback.success(result);
              } else {
                  callback.error(result);
              }
          },
          error: function(error) {
              callback.error(error);
          }
      });
  }

  var dislike = 0;
  $(".right").on("click", function() {
      // return;
      dislike = 1;
  });
  //查看说明
  $(".modal-in").on('click', function() {
      if (dislike) {

      } else {
          $(".modal-overlay-visible").hide();
          $(".modal-in").hide();
          $(".modal-dislike").hide();
      }
      dislike = 0;
  })

  //查看说明
  $(".icon-tixing").on("click", function() {
      $(".modal-overlay-visible").show();
      $(".modal-tip").show();
  })

  // //吐槽关闭
  // $(".modal-in").on('click',function(){
  //   $(".modal-overlay-visible").hide();
  //   $(".modal-dislike").hide();
  // })

  //吐槽
  $(".dislike-img,.dislike-text").on("click", function() {
      $(".modal-overlay-visible").show();
      $(".modal-dislike").show();
  })

  $(".dislike-right-li").on("click", function() {
      var text = $(this).text();
      $(".dislikeText").val(text);
  })

  //发布吐槽信息
  $(".dialog-dislike-content .send").on("click", function() {
      var dislikeText = $(".dislikeText").val();
      if (!dislikeText) {
          $.toast("你没有吐槽任何信息");
          return;
      }
      var data = {
          username: UserName,
          ask_id: AskId,
          content: dislikeText
      }
      $.showPreloader("正在吐槽");
      $.ajax({
          type: "POST",
          data: data,
          dataType: "json",
          url: "/ask/debase",
          success: function(result) {
              $.hidePreloader();
              console.log(result);
              if (result.code == 200) {
                  $.toast("吐槽成功");
                  $(".modal-dislike").hide();
                  $(".modal-overlay-visible").show();
                  $(".modal-dislike-send").show();
                  console.log(result);
              } else if(result.code == 300) {
                  // callback.error(result);
                  $.toast("您已经吐槽过了");
                  console.log(result);
              }else{
                $.toast(result.message);
                console.log(result);
              }
          },
          error: function(error) {
              $.hidePreloader();
              // callback.error(error);
              console.log(error);
          }
      });
  })

  //点击购买
  //购买逻辑
  $(".buy").on("click", function() {
          var buyed = $(".buy").attr("data-buy");

          if (($(this).text() == "朕已查阅" || $(this).text() == "朕分享的") && buyed) {
              return;
          }
          var data = {
              username: UserName,
              ask_id: AskId
          }
          buyed = 1;
          $.showPreloader("正在瞅瞅");
          $.ajax({
              type: "GET",
              data: data,
              dataType: "json",
              url: "/authorization/pay",
              success: function(result) {
                  console.log(result);
                  $.hidePreloader();
                  if (result.code == 100) {
                      //限时免费购买
                      $.toast("购买成功");
                      $(".buy").text("朕已查阅");
                      $(".buy").attr("data-buy", "1");

                      var havedNum = parseInt($(".sale-num").text());
                      havedNum++;
                      $(".sale-num").text(havedNum);

                      $(".buyed-img").show();
                      $(".dislike-content").show();
                      getHide({
                          success: function(result) {
                              var data = result.data;
                              if (data.shopName) {
                                  $(".detail-rtname").text(data.shopName);
                              } else {
                                  $(".detail-rtname").text("暂无");
                              }
                              if (data.askPosition) {
                                  var askPosition = JSON.parse(data.askPosition);
                                  var address = '';
                                  for (var key in askPosition) {
                                      console.log(askPosition[key]);
                                      // address += askPosition[key];
                                      if(key == "adetail"){
                                        address += "（";
                                      }
                                      address += askPosition[key];
                                      if(key == "adetail"){
                                        address += "）";
                                      }
                                  }
                                  $(".detail-address").text(address);
                                  $(".detail-address,.detail-rtname").attr("data-GeoX", data.GeoX);
                                  $(".detail-address,.detail-rtname").attr("data-GeoY", data.GeoY);
                              }
                          },
                          error: function(error) {
                              location.reload();
                          }
                      })
                  } else if (result.code == 200) {
                      initPay(result.payargs);
                      // initWXPay(result.payargs);
                      buyed = 0;
                  } else {
                      $.toast(result.message);
                      buyed = 0;
                  }
              },
              error: function(error) {
                  $.hidePreloader();
                  $.total("~O(∩_∩)O~ 网络好像有点问题");
                  console.log(error);
              }
          })
      })
      // $.toast("购买失败");
      // setInterval(function(){
      //   $.toast("购买失败");
      // }, 500);

  function onBridgeReady(payargs) {
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
              "appId": payargs.appId, //公众号名称，由商户传入     
              "timeStamp": payargs.timeStamp, //时间戳，自1970年以来的秒数     
              "nonceStr": payargs.nonceStr, //随机串     
              "package": payargs.package,
              "signType": payargs.signType, //微信签名方式：     
              "paySign": payargs.paySign //微信签名 
          },
          function(res) {
              //console.log(res);
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                  // window.location.reload();
                  var data = {
                      username: UserName,
                      ask_id: AskId
                  }
                  buyed = 1;
                  var havedNum = parseInt($(".sale-num").text());
                  havedNum++;
                  $(".sale-num").text(havedNum);
                  $.showPreloader("正在瞅瞅");
                  getHide({
                      success: function(result) {
                          $(".buyed-img").show();
                          $(".dislike-content").show();
                          $.hidePreloader();
                          var data = result.data;
                          $(".buy").text("朕已查阅");
                          $(".buy").attr("data-buy", "1");
                          if (data.shopName) {
                              $(".detail-rtname").text(data.shopName);
                          } else {
                              $(".detail-rtname").text("暂无");
                          }
                          if (data.askPosition) {
                              var askPosition = JSON.parse(data.askPosition);
                              var address = '';
                              for (var key in askPosition) {
                                  console.log(askPosition[key]);
                                  address += askPosition[key];
                              }
                              $(".detail-address").text(address);
                              $(".detail-address,.detail-rtname").attr("data-GeoX", data.GeoX);
                              $(".detail-address,.detail-rtname").attr("data-GeoY", data.GeoY);
                          }
                      },
                      error: function(error) {
                          $.hidePreloader();
                          location.reload();
                      }
                  })
              } else {}
          });
  }

  function initPay(payargs) {
      if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
      } else {
          onBridgeReady(payargs);
      }
  }

  function initPay(payargs) {
      if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
      } else {
          onBridgeReady(payargs);
      }
  }
