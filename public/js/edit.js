  var marker,
      map,
      LAT,
      LNG;

  var icon = new AMap.Icon({
    image: "/img/edit/marker.png",
  });

  $.showPreloader("正在加载"); 

  initLocation("edit",{
          success: function(lng,lat) {
            $.hidePreloader();
            initEdit(lat,lng);

            // initEdit();

            // if(localStorage.lng && localStorage.lat){

            // }else{
            //   //详情地点显示
            //   map = new AMap.Map('container', {
            //       resizeEnable: true,
            //       zoom: 16,
            //       center: [lng, lat],
            //       buttonOffset: new AMap.Pixel(60, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            //       zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            //       buttonPosition: 'LB'
            //   });

            //   marker = new AMap.Marker({
            //       map: map,
            //       icon: icon,
            //       position: [lng, lat],
            //       draggable: true,
            //       cursor: 'move',
            //       raiseOnDrag: true,
            //       clickable: true
            //   });

            //   map.plugin(["AMap.ToolBar"], function() {
            //       map.addControl(new AMap.ToolBar());
            //   });

            //   marker.setMap(map);
            //   initMarker(marker);
            // }
              
          },
          error: function() {
              // $.toast("定位失败");
              $.hidePreloader();
              $.toast("未获取到当前位置");
              initEdit(30.58128,103.990092);
          }
      });


if(window.location.port == 3000){
  //测试逻辑
  // initEdit(30.580596,103.982984);
  initEdit(30.58128,103.990092);
}

function initEdit(LAT,LNG){
  LAT = LAT;
  LNG = LNG;
  $(".my-location").attr("lat",LAT);
  $(".my-location").attr("lng",LNG);

  if(!localStorage.lng || !localStorage.lat){

    //详情地点显示
    map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 16,
        center: [LNG, LAT],
        buttonOffset: new AMap.Pixel(60, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition: 'LB'
    });

    marker = new AMap.Marker({
        map: map,
        icon: icon,
        position: [LNG, LAT],
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true,
        clickable: true
    });
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });

    marker.setMap(map);
    initMarker(marker);
  } 

  $(".my-location").on("click",function(){
    var lat = $(".my-location").attr("lat");
    var lng = $(".my-location").attr("lng");
    map.setZoomAndCenter(16, [lng, lat]);
  }) 

      $(".tab-item").on("click", function() {
          var type = $(this).attr("data-type");
          console.log(type);
          $(".tab-item").removeClass("active");
          $(this).addClass("active");
          if (type == "like") {
              $.router.load("/newfood?username=573b0e3df38c8400673bb48d#like");
          } else if (type == "find") {
              $.router.load("/newfood?username=573b0e3df38c8400673bb48d");
          }
      })

      //再来一发
      $(".again").on("click", function() {
          $.router.load("#router");
          window.location.reload();
      })
      $("#success .find").on("click", function() {
          $.showPreloader("正在出宫");
          // $.router.load("/newfood");
          window.location.href="/newfood";
      })

      //点击完成
      $("#success .pull-right").on("click", function() {
          $.showPreloader("正在跳转");
          // $.router.load("/newfood");
          window.location.href="/newfood";
      })

      //分享
      $("#success .share-btn").on('click', function() {
          console.log("ok");
          $("#success .modal-overlay").addClass("modal-overlay-visible");
          $("#success .modal-overlay").show();
          $("#success .modal").removeClass("modal-out");
          $("#success .modal").addClass("modal-in");
          $("#success .model-share").show();
      })
      $("#success .modal-in").on('click', function() {
          $("#success .modal-overlay-visible").hide();
          $("#success .modal-in").hide();
      })

      $("#router .icon-left").on("click", function() {
          var url = window.location.hash;
          if (!url.split("#")[1]) {
              $.showPreloader("正在跳转");
              // $.router.back();
              window.history.go(-1);
          } else {
              $.showPreloader("正在跳转");
              // $.router.load("/food");
              window.location.href = "/newfood";
          }
      })

      $(".edit-li,.next-view,.pre-view").on("click", function() {

          $("#router5 .wenwo-ul").empty();

          var href = $(this).attr("data-href");
          if (href.split("#")[1]) {
              $.router.load(href);
          } else {
              $.router.load("#" + href);
          }
      })

      $(".circle").on("touchstart", function() {
        $("#router5 .wenwo-ul").empty();
        var href = $(this).attr("data-href");
        var hrefNum = href.replace(/[^0-9]/ig,"");

        //判断当前的链接
        var nowHref = window.location.hash.split("#")[1];
        var nowHrefNum = nowHref.replace(/[^0-9]/ig,"");


        if (href.split("#")[1]) {
          if(nowHrefNum > hrefNum){
            $.router.load(href,false,"left");
          }else{
            $.router.load(href);
          }
        } else {
          $.router.load("#" + href);
        }
      })

      //地址标注说明取消
      $("#router5 .modal-in").on('click', function() {
          $("#router5 .modal-overlay-visible").hide();
          $("#router5 .modal-in").hide();
          // $("#success .modal-overlay-visible").hide();
          // $("#success .modal-in").hide();
      })

      //地址标注说明
      $("#router5 .icon-tixing").on("click", function() {
          // $("#router5 .modal-overlay-visible").show();
          // $("#router5 .model-tip").show();
          $("#router5 .modal-overlay").addClass("modal-overlay-visible");
          $("#router5 .modal-overlay").show();
          $("#router5 .modal").removeClass("modal-out");
          $("#router5 .modal").addClass("modal-in");
          $("#router5 .model-tip").show();
      })

      function initMarker(marker) {
          marker.on("dragend", function() {
              console.log(this.getPosition());
              var lat = this.getPosition().lat;
              var lng = this.getPosition().lng;
              $("#container").attr("data-lng", lng);
              $("#container").attr("data-lat", lat);
              localStorage["lng"] = lng;
              localStorage["lat"] = lat;
              var lnglatXY = [lng, lat];
              getAddress(lnglatXY, {
                  success: function(address) {
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
                      var address = JSON.stringify(address);

                      $(".address .edit-content").attr("data-address", address);
                      $(".address .edit-content").text(detail);
                      $("#address").val(detail);
                  }
              });
          })
      }

      window.onload = function() {
          map.plugin(["AMap.ToolBar"], function() {
              map.addControl(new AMap.ToolBar());
          });
          $.hidePreloader();
      }

      //得到焦点时隐藏导航按钮
      var id = '';
      $("input,textarea").focus(function() {
          id = this.id;
          $(".footer-bar").hide();
          if (this.id == "address" || this.id == "add-detail") {
              $(".amap-zoomcontrol").hide();
              $(".my-location").hide();
              return;
          }
          $(".header-bar").hide();
          $(".page-content").css("margin-top", "1rem");
      });
      $("input,textarea").blur(function() {
          $(".amap-zoomcontrol").show();
          $(".my-location").show();
          $(".footer-bar").show();
          $(".header-bar").show();
          $(".page-content").css("margin-top", "5rem");
      });
      //获取窗体高度
      var height = $(document.body).height();
      $(window).resize(function() {
          if ($(document.body).height() < height) {
              //输入框弹起
              $(".footer-bar").hide();
              $(".amap-zoomcontrol").hide();
              $(".my-location").hide();
              if (id != "address" && id != "add-detail") {
                  $(".header-bar").hide();
                  $(".page-content").css("margin-top", "1rem");
              }
          } else {
              //输入框放下
              $(".footer-bar").show();
              $(".header-bar").show();
              $(".amap-zoomcontrol").show();
              $(".my-location").show();
              $(".page-content").css("margin-top", "5rem");
          }
      })

      //修复搜索列表bug
      $("#router5").on("click", function() {
          // $("#address").focus();
          // $("#address").blur();
          // $(".amap-sug-result").css("visibility","hidden");
      })

      //判断是不是安卓手机
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      if (isAndroid) {
          $(".detail-li-name").focus(function() {
              var top = $("#router3").scrollTop();
              // alert(top);
              $("#router3").scrollTop(80);
          })
      }

      //监听textarea获取焦点逻辑

      //初始化,异步获取标签
      function getTag(themeType) {

          $.showPreloader("正在加载");

          var data = {
              type: themeType,
              size: 10
          }
          $.ajax({
              type: "GET",
              data: data,
              dataType: "json",
              url: "/ask/gettag",
              success: function(result) {
                  $.hidePreloader();
                  console.log(result);
                  if (result.code == 200) {
                      var li = ''
                      for (var i in result.data) {
                          var exit = 0;

                          $.each($(".ww-typeHelper .type-item"), function(j, v) {
                              if (result.data[i].tagName == $(v).text()) {
                                  exit = 1;
                              }
                          })
                          console.log(exit);
                          if (!exit && result.data[i].tagName) {
                              li += '<span class="type-item">' + result.data[i].tagName + '</span>';
                          }

                      }
                      $(".tag-li").empty();
                      $(".tag-li").append(li);
                  }

              },
              error: function(error) {
                  $.hidePreloader();
                  console.log(error);
              }
          })
      }

      //获取二级标签
      $("#tag-content,#router1 .next").on("click", function() {
          console.log(localStorage.type);
          var LStype = localStorage.type;
          if (LStype) {
              getTag(LStype);
          }
      })

      // //初始化marker
      // marker = new AMap.Marker({
      //     icon: icon, //24px*24px
      //     map: map,
      //     draggable: true,
      //     cursor: 'move',
      //     raiseOnDrag: true,
      //     clickable: true
      // });
      // marker.setMap(map);
      // initMarker(marker);
      //获取地址
      function getAddress(lnglatXY, callback) {
          var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
          });
          geocoder.getAddress(lnglatXY, function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                  var address = result.regeocode; //返回地址描述
                  console.log(address);
                  callback.success(address);
                  var address = {
                      province: address.addressComponent.province,
                      city: address.addressComponent.city,
                      district: address.addressComponent.district
                  }
              }
          });
      }

      //初始化localStorage数据
      function initLocationData() {

          //初始化image
          if (localStorage.editImage) {
            $(".photo-content").attr("data-href",localStorage.editImage);
            $(".photo-content").attr("data-percent","100");
            $(".photo-content").attr("src",localStorage.editImage);
            $(".photo .edit-li-img").attr("src", "/img/edit/photo-02.png");
          }

          //初始化标签
          if (localStorage.tag) {
              var tag = JSON.parse(localStorage.tag);
              var text = '';
              var span = '';
              var len = 0;
              for(var i in tag){
                len++;
                text += tag[i] + ';';
                span += '<span class="type-item">' + tag[i] + '</span>';
              }

              $(".ww-typeHelper-input").val(text);

              if (!len) {
                  $(".tag .edit-content").empty().text("请填写标签");
              } else {
                  $(".tag .edit-li-img").attr("src", "/img/edit/tag-02.png");
                  // var span = '<span class="type-item">' + tag[0] + '</span>';
                  $(".tag .edit-content").empty().append(span);
              }

          }

          //初始化推荐理由
          console.log(localStorage.reason);
          if (localStorage.reason) {
              $(".reason .edit-li-img").attr("src", "/img/edit/reason-02.png");

              //加入full
              $(".reason .edit-content").addClass("full");

              $("#reason").val(localStorage.reason);
              $(".reason .edit-content").text(localStorage.reason);
          }

          //初始化信息详情
          console.log(localStorage.detail);
          if (localStorage.detail) {
            //加入full
            $(".detail .edit-content").addClass("full");

            $("#detail").val(localStorage.detail);
            $(".edit-detail").text(localStorage.detail);
            
            $(".detail .edit-li-img").attr("src", "/img/edit/detail-02.png");
            //加入full
            $(".detail .edit-content").addClass("full");
          }

          //初始化信息详情列表
          if (localStorage.detailLi) {
              detailLi = JSON.parse(localStorage.detailLi);
              if (detailLi.length) {
                  $(".detail-li-content").empty();
                  $(".edit-detail-li-content").empty();
                  for (var i = 0; i < detailLi.length; i++) {
                      var li = '<div class="detail-li"><div class="detail-li-title"><input type="text" name="detailName' + i + '" class="detail-li-name" placeholder="填写" value="' + detailLi[i].name + '"></div><div class="detail-li-input"><input type="text" name="detailVal' + i + '" class="detail-li-val" placeholder="可以在此进行补充描述哦" value="' + detailLi[i].val + '"></div><div class="icon iconfont icon-jian"></div></div>';
                      $(".detail-li-content").append(li);
                      $(".detail-li-all-content").scrollTop(1000);

                      //初始化显示界面
                      var li = '<div class="edit-detail-li"><div class="edit-detail-li-title">' + detailLi[i].name + '</div><div class="edit-detail-li-input">' + detailLi[i].val + '</div></div>';
                      $(".edit-detail-li-content").append(li);
                  }
                $(".detail .edit-li-img").attr("src", "/img/edit/detail-02.png");
                //加入full
                $(".detail .edit-content").addClass("full");
              }
          }

          //初始化地址详情
          if (localStorage.adetail) {
            //加入full
            $(".address .edit-content").addClass("full");

            $("#add-detail").val(localStorage.adetail);
          }

          //初始化店名
          if (localStorage.name) {
            //加入full
            $(".name .edit-content").addClass("full");

            $(".name .edit-li-img").attr("src", "/img/edit/name-02.png");
            $("#name").val(localStorage.name);
            $(".name .edit-content").text(localStorage.name);
          }

          //初始化坐标信息
          var lnglatXY = [localStorage.lng, localStorage.lat];

          if (localStorage.lng && localStorage.lat) {

              // address.formattedAddress
              getAddress(lnglatXY, {
                  success: function(address) {
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
                      address = JSON.stringify(address);
                      $(".address .edit-content").attr("data-address", address);
                      $(".address .edit-content").text(detail);
                      $("#address").val(detail);
                      //加入full
                      $(".address .edit-li-img").attr("src", "/img/edit/address-02.png");
                      $(".address .edit-content").addClass("full");
                  }
              });

              $("#container").attr("data-lng", localStorage.lng);
              $("#container").attr("data-lat", localStorage.lat);

              //详情地点显示
              map = new AMap.Map('container', {
                  resizeEnable: true,
                  zoom: 16,
                  center: [localStorage.lng, localStorage.lat],
                  buttonOffset: new AMap.Pixel(60, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                  zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  buttonPosition: 'LB'
              });

              marker = new AMap.Marker({
                  map: map,
                  icon: icon,
                  position: [localStorage.lng, localStorage.lat],
                  draggable: true,
                  cursor: 'move',
                  raiseOnDrag: true,
                  clickable: true
              });

              map.plugin(["AMap.ToolBar"], function() {
                  map.addControl(new AMap.ToolBar());
              });

              marker.setMap(map);
              initMarker(marker);
          }

          //初始化价格信息
          if (localStorage.price) {

            //加入full
            $(".price .edit-content").addClass("full");

            $("#price").val(localStorage.price);
            $(".price .edit-li-img").attr("src", "/img/edit/price-02.png");
            $(".price .edit-content").text("￥" + localStorage.price);
          }
      }

      function formatDetail(data) {
          var staus = data.staus, //状态
              askTagStr = data.askTagStr, //标签
              reason = data.askReason, //理由
              askContentShow = data.askContentShow, //隐藏详情
              lnglatXY = [data.GeoX, data.GeoY], //坐标
              lat = data.GeoX,
              lng = data.GeoY,
              name = data.shopName,
              askPosition = data.askPosition,
              price = data.askPrice, //价格
              updatedAt = data.updatedAt, //分享时间
              askImage  = data.askImage,  //分享图片
              createBy = data.createBy; //分享者


          //初始化上传图片
          if(askImage){
            askImage = JSON.parse(askImage);
            if(askImage[0].image){
              $(".photo-content").attr("data-href",askImage[0].image);
              $(".photo-content").attr("data-percent","100");
              $(".photo-content").attr("src",askImage[0].image);
              $(".photo .edit-li-img").attr("src", "/img/edit/photo-02.png");
            }
          }

          //标签
          var tag = JSON.parse(askTagStr);
          if (!tag.length) {
            $(".tag .edit-content").empty().text("请填写标签");
          } else {
            $(".tag .edit-li-img").attr("src", "/img/edit/tag-02.png");
            var text = '',
                span = '';

            for(var i in tag){
              text += tag[i].tag_name + ';';
              span += '<span class="type-item">' + tag[i].tag_name + '</span>';
            }
            $(".ww-typeHelper-input").val(text);
            $(".tag .edit-li-img").attr("src", "/img/edit/tag-02.png");
            $(".tag .edit-content").empty().append(span);

          }

          //推荐理由
          if (reason) {
            //加入full
            $(".reason .edit-content").addClass("full");

            $(".reason .edit-li-img").attr("src", "/img/edit/reason-02.png");
            $("#reason").val(reason);
            $(".reason .edit-content").text(reason);
          }

          //解析详情
          var askContentShow = JSON.parse(askContentShow);
          var detail = askContentShow.detail;

          if (detail) {
            //加入full
            $(".detail .edit-content").addClass("full");
            $(".detail .edit-li-img").attr("src", "/img/edit/detail-02.png");

            $("#detail").val(detail);
            $(".edit-detail").text(detail);
          }
          //初始化信息详情列表
          if (askContentShow.detailLi) {
            if(askContentShow.detailLi[0].name){
              var detailLi = askContentShow.detailLi;
            }else{
              var detailLi = askContentShow.detailLi;
              detailLi = JSON.parse(detailLi);
            }
          }
          if (detailLi.length) {
            $(".detail-li-content").empty();
            $(".edit-detail-li-content").empty();
            for (var i = 0; i < detailLi.length; i++) {
              var li = '<div class="detail-li"><div class="detail-li-title"><input type="text" name="detailName' + i + '" class="detail-li-name" placeholder="填写" value="' + detailLi[i].name + '"></div><div class="detail-li-input"><input type="text" name="detailVal' + i + '" class="detail-li-val" placeholder="可以在此进行补充描述哦" value="' + detailLi[i].val + '"></div><div class="icon iconfont icon-jian"></div></div>';
              $(".detail-li-content").append(li);
              $(".detail-li-all-content").scrollTop(1000);
              //初始化显示界面
              var li = '<div class="edit-detail-li"><div class="edit-detail-li-title">' + detailLi[i].name + '</div><div class="edit-detail-li-input">' + detailLi[i].val + '</div></div>';
              $(".edit-detail-li-content").append(li);
            }
          }


          //解析地址详情
          var adetail = JSON.parse(askPosition).adetail;
          if (adetail) {
            $("#add-detail").val(adetail);
          }

          //解析店名
          if (name) {
            //加入full
            $(".name .edit-content").addClass("full");

            $(".name .edit-li-img").attr("src", "/img/edit/name-02.png");
            $("#name").val(name);
            $(".name .edit-content").text(name);
          }

          //初始化坐标信息
          console.log(lng);
          console.log(lat);
          var lnglatXY = [lng, lat];

          if (lng && lat) {

              // address.formattedAddress
              getAddress(lnglatXY, {
                  success: function(address) {
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
                      address = JSON.stringify(address);
                      $(".address .edit-content").attr("data-address", address);
                      $(".address .edit-content").text(detail);
                      $("#address").val(detail);
                      //加入full
                      $(".address .edit-li-img").attr("src", "/img/edit/address-02.png");

                      $(".address .edit-content").addClass("full");
                  }
              });

              $("#container").attr("data-lng", lng);
              $("#container").attr("data-lat", lat);


              //解析地址
              map = new AMap.Map('container', {
                  resizeEnable: true,
                  zoom: 16,
                  center: [lng, lat],
                  buttonOffset: new AMap.Pixel(60, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                  zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  buttonPosition: 'LB'
              });

              marker = new AMap.Marker({
                  map: map,
                  icon: icon,
                  position: [lng, lat],
                  draggable: true,
                  cursor: 'move',
                  raiseOnDrag: true,
                  clickable: true
              });

              marker.setMap(map);
              initMarker(marker);
          }

          //价格
          console.log(price);
          if (price) {
            //加入full
            $(".price .edit-content").addClass("full");

            $("#price").val(price);
            $(".price .edit-li-img").attr("src", "/img/edit/price-02.png");
            $(".price .edit-content").text("￥" + price);
          }

      }

      function initEditData(sendAskId) {
          $.showPreloader("正在加载数据");
          $.ajax({
              type: "POST",
              url: '/ask/askdetail',
              data: { ask_id: sendAskId, username: UserName },
              dataType: "json",
              success: function(result) {
                  console.log(result);
                  $.hidePreloader();
                  if (result.code == 200) {
                    if(result.show.isOwnFlag){
                      formatDetail(result.data);
                    }else{
                      $.toast("不能更改其他用户信息");
                      var error = '<div class="error-content content pull-to-refresh-content" data-ptr-distance="55"><div class="pull-to-refresh-layer"><div class="preloader"></div><div class="pull-to-refresh-arrow"></div></div><div class="card-container no-user">非法操作...</div></div>';
                      $("body").empty().append(error);
                    }
                  }
              },
              error: function(error) {
                $.hidePreloader();
                $.alert("网络异常");
              }
          })
      }

      if (sendType == "edit") {
          console.log("edit");
          $("#router .title").text("编辑");
          initEditData(sendAskId);
      } else {
          $("#router .title").text("分享");
          initLocationData();
      }

      $(".card,.theme-list-content").on("click", function() {
          var href = $(this).data("href");
          if (href) {
              $.router.load("#" + href);
          }
      })

      //点击删除美食详情列表
      $("#router3").on("click", ".icon-jian", function() {
          //移除选中信息
          console.log("123");
          $(this).parent().remove();

          var detailLi = getAllDetailLiV();
          if (detailLi.length) {
              $(".edit-detail-li-content").empty();
              for (var i = 0; i < detailLi.length; i++) {
                  //更新显示界面
                  var li = '<div class="edit-detail-li"><div class="edit-detail-li-title">' + detailLi[i].name + '</div><div class="edit-detail-li-input">' + detailLi[i].val + '</div></div>';
                  $(".edit-detail-li-content").append(li);
              }
          } else {
              $(".edit-detail-li-content").empty();
          }
          //保存到本地数据
          detailLi = JSON.stringify(detailLi);
          console.log(detailLi);
          localStorage["detailLi"] = detailLi;
      })

      //帮助
      $(".help").on("click", function() {
          if ($(".help-content").hasClass("help-content-active")) {
              $(".help-content").hide();
              $(".help-content").removeClass("help-content-active");
          } else {
              $(".help-content").show();
              $(".help-content").addClass("help-content-active");
          }
      })

      function setlocalStorageTag() {
          //获取填写的tag
          var text = $(".ww-typeHelper-input").val();
          var inputText = text;
          var k = 0;
          var tag = {};

          for(var i = 0; i < inputText.split(";").length; i++){
            if(inputText.split(";")[i]){
              for(var j = 0; j < inputText.split(";")[i].split("；").length; j++){
                if(inputText.split(";")[i].split("；")[j]){
                  tag[k] = inputText.split(";")[i].split("；")[j];
                  k++;
                } 
              }
            }
          }

          tag = JSON.stringify(tag);
          localStorage["tag"] = tag;
      }
      //在输入框内添加标签
      $(".ww-typeHelper-input").on("input change", function() {
          var text = $(this).val();

          var inputText =  $(this).val();
          var length = 0;
          for(var i = 0; i < inputText.split(";").length; i++){
            console.log(inputText.split(";")[i]);
            if(inputText.split(";")[i]){
              for(var j = 0; j < inputText.split(";")[i].split("；").length; j++){
                if(inputText.split(";")[i].split("；")[j]){
                  length++;
                } 
              }
            }
          }

          if(length > 3){
            $.toast("最多加添加三个标签");
            return;
          }
          setlocalStorageTag();

          var span = '';
          for(var i = 0; i < inputText.split(";").length; i++){
            console.log(inputText.split(";")[i]);
            if(inputText.split(";")[i]){
              // span += '<span class="type-item">' + inputText.split(";")[i] + '</span>';
              for(var j = 0; j < inputText.split(";")[i].split("；").length; j++){
                if(inputText.split(";")[i].split("；")[j]){
                  span += '<span class="type-item">' + inputText.split(";")[i].split("；")[j] + '</span>';
                } 
              }
            }
          }

          // var span = '<span class="type-item">' + text + '</span>';
          $(".tag .edit-content").empty().append(span);

          $(".tag .edit-li-img").attr("src", "/img/edit/tag-02.png");

          if (text.length <= 0) {
            $(".tag .edit-li-img").attr("src", "/img/edit/tag-01.png");
            $(".tag .edit-content").empty().text("请填写标签");
          }
      })

      //点击二级标签删除主页二级标签
      $(".tag-ul").on("click", ".type-item", function() {
        var inputText =  $(".ww-typeHelper-input").val();

        var length = 0;
        for(var i = 0; i < inputText.split(";").length; i++){
          if(inputText.split(";")[i]){
            for(var j = 0; j < inputText.split(";")[i].split("；").length; j++){
              if(inputText.split(";")[i].split("；")[j]){
                length++;
              } 
            }
          }
        }

        if(length >= 3){
          $.toast("最多加添加三个标签");
          return;
        }

        var text = $(this).text();
        $(".ww-typeHelper-input").val(inputText+text+";");

        inputText =  $(".ww-typeHelper-input").val();
  
        $(".tag .edit-li-img").attr("src", "/img/edit/tag-02.png");
        //获取填写的tag
        setlocalStorageTag();
        // var span = '<span class="type-item">' + text + '</span>';
        var span = '';
        for(var i = 0; i < inputText.split(";").length; i++){
          if(inputText.split(";")[i]){
            for(var j = 0; j < inputText.split(";")[i].split("；").length; j++){
              if(inputText.split(";")[i].split("；")[j]){
                span += '<span class="type-item">' + inputText.split(";")[i].split("；")[j] + '</span>';
              } 
            }
          }
        }

        $(".tag .edit-content").empty().append(span);
      })

      //设置内容填充函数
      function setFull(type,judge){
        $("."+type+" .edit-li-img").attr("src", "/img/edit/"+type+"-02.png");
        //加入full
        $("."+type+" .edit-content").addClass("full");
        if (judge) {
          $("."+type+" .edit-li-img").attr("src", "/img/edit/"+type+"-01.png");
          //移除full
          $("."+type+" .edit-content").removeClass("full");
        }
      }

      //推荐理由输入后显示到主页
      $("#reason").on("input change", function() {
          $("#reason").text($(this).val());
          localStorage["reason"] = $(this).val();
          $(".reason .edit-content").text($(this).val());

          // $(".reason .edit-li-img").attr("src", "/img/edit/reason-02.png");
          // //加入full
          // $(".reason .edit-content").addClass("full");
          // if ($(this).val().length <= 0) {
          //   $(".reason .edit-li-img").attr("src", "/img/edit/reason-01.png");
          //   //移除full
          //   $(".reason .edit-content").addClass("full");
          // }
          var judge = $(this).val().length <= 0;
          setFull("reason",judge);
          if (judge) {
            $(".reason .edit-content").empty().text("请填写推荐理由");
          }
      })

      $(".detail-add").on("click", function() {
          var len = $(".detail-li").length;
          console.log(len);
          var li = '<div class="detail-li"><div class="detail-li-title"><input type="text" name="detailName' + len + '" class="detail-li-name" placeholder="填写"></div><div class="detail-li-input"><input type="text" name="detailVal' + len + '" class="detail-li-val" placeholder="请在此对卡片内容进行描述"></div><div class="icon iconfont icon-jian"></div></div>';
          $(".detail-li-content").append(li);
          $(".detail-li-all-content").scrollTop(1200);
      })

      function getAllDetailLiV() {
          //遍历所有的detail-li
          var detailLi = [];
          var j = 0;
          $(".detail-li").each(function(i, v) {
              //获取所有detail-li里面的name
              var name = $(this).children(".detail-li-title").children("input").val();
              var val = $(this).children(".detail-li-input").children("input").val();
              var key = {};
              if (name && val) {
                  key.name = name;
                  key.val = val;
                  detailLi[j] = key;
                  j++;
              }
          })
          return detailLi;
      }

      function initMap(lnglatXY) {
          map = new AMap.Map('container', {
              resizeEnable: true,
              zoom: 16,
              center: lnglatXY,
              buttonOffset: new AMap.Pixel(60, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              buttonPosition: 'LB'
          });
      }

      $(".detail-li-all-content").on("input change", "input", function() {
          var detailLi = getAllDetailLiV();
          if (detailLi.length) {
              $(".edit-detail-li-content").empty();
              for (var i = 0; i < detailLi.length; i++) {
                  //更新显示界面
                  var li = '<div class="edit-detail-li"><div class="edit-detail-li-title">' + detailLi[i].name + '</div><div class="edit-detail-li-input">' + detailLi[i].val + '</div></div>';
                  $(".edit-detail-li-content").append(li);
              }
              $(".detail .edit-li-img").attr("src", "/img/edit/detail-02.png");
              //加入full
              $(".detail .edit-content").addClass("full");
          } else {
              $(".edit-detail-li-content").empty();
              if($(".detail .edit-detail").text().length <= 0){
                $(".detail .edit-li-img").attr("src", "/img/edit/detail-01.png");
                //加入full
                $(".detail .edit-content").removeClass("full");
              }
          }
          //保存到本地数据
          detailLi = JSON.stringify(detailLi);
          console.log(detailLi);
          localStorage["detailLi"] = detailLi;

      })

      //点击示例显示到推荐理由
      $(".eg-li").on("click", function() {
          var text = $(this).text();
          var text = text.split(":")[1];
          $("#reason").val(text);
          $(".reason .edit-content").text(text);
          //保存到本地数据
          localStorage["reason"] = text;

          $(".reason .edit-li-img").attr("src", "/img/edit/reason-02.png");
          //加入full
          $(".reason .edit-content").addClass("full");
      })

      //地址详情
      $("#add-detail").on("input change", function() {
          localStorage["adetail"] = $(this).val();
      })


      //详情输入后显示到主页
      $("#detail").on("input change", function() {
          var text = $("#detail").val();
          //显示到主页
          $(".edit-detail").text(text);
          localStorage["detail"] = $("#detail").val();

          $(".detail .edit-li-img").attr("src", "/img/edit/detail-02.png");
          //加入full
          $(".detail .edit-content").addClass("full");
          if($(this).val().length <= 0 && $(".edit-detail-li").text().length <= 0){
            $(".detail .edit-li-img").attr("src", "/img/edit/detail-01.png");
            //加入full
            $(".detail .edit-content").removeClass("full");
          }
          if($(this).val().length <= 0){
            $(".detail .edit-detail").text("请填写美食详情");
          }
        // if (judge) {
        //   $("."+type+" .edit-li-img").attr("src", "/img/edit/"+type+"-01.png");
        //   //移除full
        //   $("."+type+" .edit-content").removeClass("full");
        // }
      })

      //更改店名时候调用
      $("#name").on("input change", function() {
          $("#name").text($(this).val());
          localStorage["name"] = $(this).val();
          $(".name .edit-content").text($(this).val());

          var judge = $(this).val().length <= 0;
          setFull("name",judge);
          if (judge) {
            $(".name .edit-content").empty().text("请填写店名");
          }
      })

      //更换价格的时候调用
      $("#price").on("input change", function() {
          var price = $(this).val();
          var priceFloat = parseFloat(price);
          // alert(price.length);
          if (!price) {
              price = 0;
              $.toast("只能输入数字且不能为空");
              return;
          }
          if (priceFloat != price || isNaN(price)) {
              $.toast("输入格式不对");
              return;
          }
          if (priceFloat > 5) {
              $.toast("输入价格不能高于5元");
              return;
          }
          if (priceFloat < 0) {
              $.toast("输入价格不能小于0元");
              return;
          }
          var judge = $(this).val().length <= 0;
          setFull("price",judge);

          localStorage["price"] = $(this).val();
          $(".price .edit-content").text("￥" + $(this).val());
      })

      //监听手机是否返回
      window.onpopstate = function(event) {
          // alert($(".page-current")[0].id);
          var id = $(".page-current")[0].id;
          if(id == "success"){
            window.location.href="/food";
          }
          $("#address").blur();
          // $(".amap-sug-result").hide(); 
      };


      var sendClick = 0;
      //提交所有信息
      $(".send-button-a").on("click", function() {
          if (sendClick) {
              return;
          }
          var tag = new Array(), //二级标签
              reason, //推荐理由
              content_show = {}, //详情显示部分
              shopName, //店名
              lat, //经度
              lng, //维度
              price = 0.00; //信息价格

          //获取填入美食的类别
          var $_tag = $(".ww-typeHelper-input").val();
          if (!$_tag) {
              $.toast("你还没有填写美食的类别");
              return;
          } else {
            var k = 0;
            var inputText = $_tag;
            for(var i = 0; i < inputText.split(";").length; i++){
              if(inputText.split(";")[i]){
                for(var j = 0; j < inputText.split(";")[i].split("；").length; j++){
                  if(inputText.split(";")[i].split("；")[j]){
                    tag[k] = {
                        tag_name: inputText.split(";")[i].split("；")[j]
                    }
                    k++;
                  } 
                }
              }
            }
            tag = JSON.stringify(tag);
          }

          //获取推荐理由
          var reason = $("#reason").val();
          if (!reason) {
              $.toast("你还没有填写推荐理由");
              return;
          }

          //获取详情
          var detail = $("#detail").val();
          if (detail) {
              var detailLi = getAllDetailLiV();
              content_show.detail = detail;
              if (detailLi.length) {
                  detailLi = JSON.stringify(detailLi);
                  content_show.detailLi = detailLi;
              }
          } else {
              var detailLi = getAllDetailLiV();
              if (!detailLi.length) {
                  $.toast("你还没有填写任何信息详情");
                  return;
              } else {
                  detailLi = JSON.stringify(detailLi);
                  content_show.detailLi = detailLi;
              }
          }
          content_show = JSON.stringify(content_show);

          //获取店名
          var shopName = $("#name").val();
          if (!shopName) {
              $.toast("你还没有填写店名");
              return;
          }

          //获取标注位置的经纬度
          lng = $("#container").attr("data-lng");
          lat = $("#container").attr("data-lat");
          if (!lng || !lat) {
              $.toast("你还没有添加地图标注");
              return;
          }

          //获取地址详情
          var askPosition = $(".address .edit-content").attr("data-address");
          if (askPosition) {
              var adetail = $("#add-detail").val();
              // if (adetail) {
              //     askPosition = JSON.parse(askPosition);
              //     askPosition.adetail = adetail;
              //     askPosition = JSON.stringify(askPosition);
              // }
              askPosition = JSON.parse(askPosition);
              askPosition.adetail = (adetail ? adetail : '');
              askPosition = JSON.stringify(askPosition);
              console.log(askPosition);
          }

          if (!askPosition) {
              $.toast("你地图没有标注上");
              return;
          }

          //获取信息价格
          price = $("#price").val().replace(/\s+/g, "");
          var priceFloat = parseFloat(price);
          if (!price) {
              price = 0;
              return;
          }
          if (priceFloat != price) {
              $.toast("信息价格格式不对");
              return;
          }
          if (priceFloat > 5) {
              $.toast("信息价格不能高于5元");
              return;
          }
          if (priceFloat < 0) {
              $.toast("信息价格不能小于0元");
              return;
          }
          var price = priceFloat.toFixed(1);
          if (price == 0.0) {
              price = 0;
          }

          if (lat > 90) {
              var change = lat;
              lat = lng;
              lng = change;
          }

          var data = {
              username: UserName,
              type: 1,
              tag: tag,
              reason: reason,
              content_show: content_show,
              content_hide: 'no',
              position: askPosition,
              geo_x: lat,
              geo_y: lng,
              shop_name: shopName,
              price: price
          }
          console.log(data);

          //发送请求 url：/ask/sendask

          
          //屏蔽多次点击
          sendClick = 1;
        if (sendType == "edit") {
          $.showPreloader("正在编辑");
        }else{
          $.showPreloader("正在分享");
        }
        timer = setInterval(function(){
          var percent = $(".photo-content").attr("data-percent");
          if(percent == "-1" || percent == "100" || percent == -1 || percent == 100){
            clearInterval(timer);
            var askImage = [];
            if($(".photo-content").attr("data-href")){
              var image = {
                image : $(".photo-content").attr("data-href")
              };
              askImage[0] = image;
              data.images = JSON.stringify(askImage);
            }
            timerNumber++;
            if(timerNumber >= 1){
              clearInterval(timer);
            }
          if (sendType == "edit") {
              data["ask_id"] = sendAskId;
              $.ajax({
                  type: "POST",
                  data: data,
                  dataType: "json",
                  url: "/ask/askedit",
                  success: function(result) {
                      console.log(result);
                      //释放多次点击
                      sendClick = 0;

                      if (result.code == 200) {
                          $.hidePreloader();
                          $.toast("编辑成功");
                          localStorage.clear();

                          var data = result.data;
                          WX_SHARE_LINK = "http://www.wenwobei.com/detail?askid=" + data.objectId;
                          WX_SHARE_IMGURL = data.createByUrl;
                          WX_SHARE_DESC = data.askReason;
                          var askPosition = data.askPosition;
                          askPosition = JSON.parse(askPosition);
                          detail = askPosition.detail;
                          if (detail.length <= 8) {
                              detail = detail;
                          } else {
                              detail = detail.substr(0, 8) + "...";
                          }
                          // WX_SHARE_TITLE = "我分享了「" + detail + "」附近的美食,瞅瞅波？";
                          WX_SHARE_TITLE = data.askReason;

                          askTagStr = JSON.parse(tag);
                          tag = askTagStr[0].tag_name;

                          WX_SHARE_DESC = "我 : 分享了「" + tag + "」美食,瞅瞅波？";
                          initShare();
                          $(".share-success,.success-text").text("编辑成功");

                          $.router.load("#success");
                      } else {
                          $.toast("编辑失败");
                          $.hidePreloader();
                          $.toast(result.message);
                      }
                  },
                  error: function(error) {
                      // alert(error);
                      $.hidePreloader();
                      $.toast("服务器异常");
                  }
              });
          } else {
              $.ajax({
                  type: "POST",
                  data: data,
                  dataType: "json",
                  url: "/ask/sendask",
                  success: function(result) {
                      console.log(result);
                      //释放多次点击
                      sendClick = 0;
                      if (result.code == 200) {
                          $.hidePreloader();
                          $.toast("分享成功");

                          localStorage.clear();
                          var askId = result.data.objectId;
                          $.showPreloader("正在跳转");

                          var data = result.data;
                          WX_SHARE_LINK = "http://www.wenwobei.com/detail?askid=" + data.objectId;
                          WX_SHARE_IMGURL = data.createByUrl;
                          // WX_SHARE_DESC = data.askReason;
                          var askPosition = data.askPosition;
                          askPosition = JSON.parse(askPosition);
                          // detail = askPosition.detail;
                          // WX_SHARE_TITLE = "我分享了" + detail + "的美食,瞅瞅波？"
                          detail = askPosition.detail;
                          if (detail.length <= 8) {
                              detail = detail;
                          } else {
                              detail = detail.substr(0, 8) + "...";
                          }
                          // WX_SHARE_TITLE = "我分享了「" + detail + "」附近的美食,瞅瞅波？";
                          WX_SHARE_TITLE = data.askReason;

                          askTagStr = JSON.parse(tag);
                          tag = askTagStr[0].tag_name;
                          WX_SHARE_DESC = "我 : 分享了「" + tag + "」美食,瞅瞅波？";
                          initShare();

                          $.router.load("#success");
                      } else {
                          $.toast("分享失败");
                          $.hidePreloader();
                          $.toast(result.message);
                      }
                  },
                  error: function(error) {
                      // alert(error);
                      sendClick = 0;
                      $.hidePreloader();
                      $.toast("服务器异常");
                  }
              });
            }
          }
        }, 10);
      })

      //输入框填写的地址内容
      $("#address").on("input change", function() {
          localStorage["address"] = $(this).val();
      })

      //地点搜索
       $("#address").on("input change",function(){
        var text = $("#address").val().replace(/(^\s*)|(\s*$)/g, "");

        console.log(text);
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
                $("#router5 .wenwo-ul").empty().append(sug);
                $("#router5 .wenwo-ul").show();
              } else {
                var noResult = '<div class="no-address"><img src="/img/food/want-empty.svg" class="no-address-img" alt=""><label class="no-result">没有搜索结果</label><label>换个关键词试试</label></div>';
                $("#router5 .wenwo-ul").empty().append(noResult);
                $("#router5 .wenwo-ul").show();
              }
              var text = $("#address").val();
              if(!text.length){
                $("#router5 .wenwo-ul").hide();
              }
            });
          });
        }else{
          $("#router5 .wenwo-ul").empty().hide();;
        }
      })

      $("#router5").on("click", ".auto-item", function() {
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
              $("#router5 .wenwo-ul").empty();

                      map.setZoomAndCenter(19, lnglatXY);
                      getAddress(lnglatXY, {
                          success: function(address) {
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
                              var address = JSON.stringify(address);
                              $(".address .edit-content").attr("data-address", address);
                              $(".address .edit-content").text(detail);
                              $("#address").val(detail);
                          }
                      });
                      //选择后存储坐标
                      localStorage["lng"] = lng;
                      localStorage["lat"] = lat;
                      $("#container").attr("data-lng", lng);
                      $("#container").attr("data-lat", lat);
                      map.clearMap();
                      marker = new AMap.Marker({
                          icon: icon, //24px*24px
                          map: map,
                          position: lnglatXY,
                          draggable: true,
                          cursor: 'move',
                          raiseOnDrag: true,
                          clickable: true
                      });
                      marker.setMap(map);
                      initMarker(marker);
                  }
                  return;
          });
        });
      });

      var timeIv;
      //地点标注搜索
      // AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function() {
      //     var autoOptions = {
      //         input: "address" //使用联想输入的input的id
      //     };
      //     autocomplete = new AMap.Autocomplete(autoOptions);
      //     var placeSearch = new AMap.PlaceSearch({
      //         map: map
      //     })
      //     AMap.event.addListener(autocomplete, "select", function(e) {
      //         placeSearch.setCity(e.poi.adcode);
      //         placeSearch.search(e.poi.name, function(status, result) {
      //             console.log(result);
      //             if (result.info == "OK") {
      //                 var lng = result.poiList.pois[0].location.lng;
      //                 var lat = result.poiList.pois[0].location.lat;
      //                 var lnglatXY = [lng, lat];
      //                 map.setZoomAndCenter(19, lnglatXY);
      //                 getAddress(lnglatXY, {
      //                     success: function(address) {
      //                         var detail = address.formattedAddress;
      //                         var address = {
      //                             province: address.addressComponent.province,
      //                             city: address.addressComponent.city,
      //                             district: address.addressComponent.district,
      //                             township: address.addressComponent.township
      //                         }
      //                         var replace = "" + address.province + address.city + address.district + address.township + "";
      //                         detail = detail.replace(replace, "");
      //                         address.detail = detail;
      //                         var address = JSON.stringify(address);
      //                         $(".address .edit-content").attr("data-address", address);
      //                         $(".address .edit-content").text(detail);
      //                         $("#address").val(detail);
      //                     }
      //                 });
      //                 //选择后存储坐标
      //                 localStorage["lng"] = lng;
      //                 localStorage["lat"] = lat;
      //                 $("#container").attr("data-lng", lng);
      //                 $("#container").attr("data-lat", lat);
      //                 map.clearMap();
      //                 marker = new AMap.Marker({
      //                     icon: icon, //24px*24px
      //                     map: map,
      //                     position: lnglatXY,
      //                     draggable: true,
      //                     cursor: 'move',
      //                     raiseOnDrag: true,
      //                     clickable: true
      //                 });
      //                 marker.setMap(map);
      //                 initMarker(marker);
      //             }
      //             return;
      //         });
      //     });
      // });

      //点击搜素按钮
      $(".search").on("click", function() {
        $("#address").val("");
        $("#router5 .wenwo-ul").empty();
      })
      // $(".search").on("click", function() {
      //     var text = $("#address").val();
      //     $("#router5 .wenwo-ul").empty();
      //     AMap.service(["AMap.PlaceSearch"], function() {
      //         var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
      //             map: map
      //         });
      //         //关键字查询
      //         placeSearch.search(text, function(statu, result) {
      //             console.log(result);
      //             if (result.info == "OK") {
      //                 $("#router5 .wenwo-ul").empty();

      //                 var lng = result.poiList.pois[0].location.lng;
      //                 var lat = result.poiList.pois[0].location.lat;
      //                 var lnglatXY = [lng, lat];
      //                 map.setZoomAndCenter(19, lnglatXY);
      //                 getAddress(lnglatXY, {
      //                     success: function(address) {
      //                         var detail = address.formattedAddress;
      //                         var address = {
      //                             province: address.addressComponent.province,
      //                             city: address.addressComponent.city,
      //                             district: address.addressComponent.district,
      //                             township: address.addressComponent.township
      //                         }

      //                         var replace = "" + address.province + address.city + address.district + address.township + "";
      //                         detail = detail.replace(replace, "");
      //                         address.detail = detail;
      //                         var address = JSON.stringify(address);
      //                         $(".address .edit-content").attr("data-address", address);
      //                         $(".address .edit-content").text(detail);
      //                         $("#address").val(detail);
      //                     }
      //                 });
      //                 //选择后存储坐标
      //                 localStorage["lng"] = lng;
      //                 localStorage["lat"] = lat;
      //                 $("#container").attr("data-lng", lng);
      //                 $("#container").attr("data-lat", lat);
      //                 map.clearMap();
      //                 marker = new AMap.Marker({
      //                     icon: icon, //24px*24px
      //                     map: map,
      //                     position: lnglatXY,
      //                     draggable: true,
      //                     cursor: 'move',
      //                     raiseOnDrag: true,
      //                     clickable: true
      //                 });
      //                 marker.setMap(map);
      //                 initMarker(marker);
      //             } else {
      //                 $.toast("未查找到结果，请尝试修改查询条件");
      //             }
      //         });
      //         // placeSearch.on("complete",function(){

      //         // })
      //     });
      // })

      // $.toast("未查找到结果，请尝试修改查询条件");
      //点击标注
      map.on('click', function(e) {
          //隐藏列表
          $(".amap-sug-result").css("visibility", "hidden");

          $(".address .edit-li-img").attr("src", "/img/edit/address-02.png");
          //加入full
          $(".address .edit-content").addClass("full");

          map.clearMap();
          lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]; //已知点坐标
          getAddress(lnglatXY, {
              success: function(address) {
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
                  var address = JSON.stringify(address);
                  console.log(address);
                  $(".address .edit-content").attr("data-address", address);
                  $(".address .edit-content").text(detail);
                  $("#address").val(detail);
              }
          });

          marker = new AMap.Marker({
              icon: icon, //24px*24px
              map: map,
              position: [e.lnglat.getLng(), e.lnglat.getLat()],
              draggable: true,
              cursor: 'move',
              raiseOnDrag: true,
              clickable: true
          });

          localStorage["lng"] = e.lnglat.getLng();
          localStorage["lat"] = e.lnglat.getLat();

          $("#container").attr("data-lng", e.lnglat.getLng());
          $("#container").attr("data-lat", e.lnglat.getLat());
          // //拖动标注后回调的坐标
          marker.setMap(map);
          initMarker(marker);
      });
}
