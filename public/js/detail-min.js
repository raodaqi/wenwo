onlyInitShare();console.log(UserName);if(AskId){getAskDetail(AskId,UserName)}function init(){var url=window.location.hash;if(url.split("#")[1]){URL="food"}}function getAskDetail(askid,username){var username=username?username:'';var data={username:username,ask_id:askid}$.ajax({type:"POST",data:data,dataType:"json",url:"/ask/askdetail",success:function(result){console.log(result);if(result.code==200){var data=result.data;$(".title").text(formatTag(data.askTagStr));$(".username").text(data.createByName);$(".like-num").text(data.likeNum);WX_SHARE_LINK="http://www.wenwobei.com/detail?askid="+data.objectId;WX_SHARE_IMGURL=data.createByUrl;WX_SHARE_TITLE=data.askReason;console.log(WX_SHARE_TITLE);var askTagStr=data.askTagStr;askTagStr=JSON.parse(askTagStr);tag=askTagStr[0].tag_name;WX_SHARE_DESC=data.createByName+" : 分享了「"+tag+"」美食,瞅瞅波？"initShare();if(data.score<10){$(".buy").text("限时免费");$(".buy").addClass("free")}if(result.show.foodLikeFlag){$(".like").addClass("liked")}else{$(".like").removeClass("liked")}if(result.show.isOwnFlag){$(".buy").text("朕分享的");$(".buy").attr("data-buy","1")}if(result.show.havedFlag){$(".buy").text("朕已查阅");$(".buy").attr("data-buy","1");$(".buyed-img").show();$(".dislike-content").show()}if(result.show.havedFlag||result.show.isOwnFlag){if(data.shopName){$(".detail-rtname").text(data.shopName)}else{$(".detail-rtname").text("暂无")}if(data.askPosition){var askPosition=JSON.parse(data.askPosition);var address='';for(var key in askPosition){console.log(askPosition[key]);address+=askPosition[key]}$(".detail-address").text(address);$(".detail-address").attr("data-GeoX",data.GeoX);$(".detail-address").attr("data-GeoY",data.GeoY)}}$(".price").text(data.askPrice);$(".pic-bg").attr("src",data.createByUrl);$(".detail-reason").text(data.askReason);var contentShow=data.askContentShow;if(contentShow){if(contentShow.indexOf("{")==-1||contentShow.indexOf("}")==-1||contentShow.indexOf(":")==-1){$(".detail-content").text(contentShow)}else{contentShow=JSON.parse(contentShow);console.log(contentShow);if(contentShow.detail||contentShow.detailLi){if(contentShow.detail){$(".edit-detail").text(contentShow.detail)}if(contentShow.detailLi){console.log(contentShow.detailLi);var detailLi=contentShow.detailLi;detailLi=JSON.parse(detailLi);$(".edit-detail-li-content").empty();for(var i=0;i<detailLi.length;i++){var li='<div class="edit-detail-li"><div class="edit-detail-li-title">'+detailLi[i].name+'</div><div class="edit-detail-li-input">'+detailLi[i].val+'</div></div>';$(".edit-detail-li-content").append(li)}}}}}$(".preloader-modal").hide();$("#detail").show()}else{$(".preloader-modal").hide();$("body").empty();var error='<div class="error-content content pull-to-refresh-content" data-ptr-distance="55"><div class="pull-to-refresh-layer"><div class="preloader"></div><div class="pull-to-refresh-arrow"></div></div><div class="card-container no-user">'+result.message+'</div></div>';$("body").append(error)}},error:function(error){console.log(error);$(".preloader-modal").hide();$("body").empty();var error='<div class="error-content content pull-to-refresh-content" data-ptr-distance="55"><div class="pull-to-refresh-layer"><div class="preloader"></div><div class="pull-to-refresh-arrow"></div></div><div class="card-container no-user">服务器出错</div></div>';$("body").append(error)},})}init();$(".tab-item").on("click",function(){var type=$(this).attr("data-type");console.log(type);$(".tab-item").removeClass("active");$(this).addClass("active");if(type=="like"){$.router.load("#like")}else if(type=="find"){$.router.load("#find")}else if(type=="edit"){$.router.load("/edit?username=573c1eb271cfe4006c18274f")}})$("#detail .icon-left").on("click",function(){$.showPreloader("正在跳转");if(URL=="food"){window.history.go(-1)}else{window.location.href="/food"}})$(".detail-address").on("click",function(){var lat=$(this).attr("data-geox");var lng=$(this).attr("data-geoy");if(lat&&lng){window.location.href="/map?lat="+lat+"&lng="+lng}})$(".content").on("click",".like",function(){var askId=AskId;var num=$(".like-num").text();console.log($("liked"));if($(this).hasClass("liked")){num=parseInt(num)-1;$(".like-num").text(num);$(this).removeClass("liked");cancelLike(UserName,askId,'',{success:function(result){console.log(result);if(result.code==200){}else{num++;$(".like-num").text(num);$(".like").addClass("liked")}},error:function(error){console.log(error);num++;$(".like-num").text(num);$(".like").addClass("liked")}})}else{num=parseInt(num)+1;$(".like-num").text(num);$(this).addClass("liked");like(UserName,askId,'',{success:function(result){console.log(result);if(result.code==200){}else{num--;$(".like-num").text(num);$(".like").removeClass("liked")}},error:function(error){console.log(error);num--;$(".like-num").text(num);$(".like").removeClass("liked")}})}})function getHide(callback){var data={username:UserName,ask_id:AskId}$.ajax({type:"POST",data:data,dataType:"json",url:"/ask/askdetail",success:function(result){console.log(result);if(result.code==200){callback.success(result)}else{callback.error(result)}},error:function(error){callback.error(error)}})}var dislike=0;$(".right").on("click",function(){dislike=1});$(".modal-in").on('click',function(){if(dislike){}else{$(".modal-overlay-visible").hide();$(".modal-in").hide();$(".modal-dislike").hide()}dislike=0})$(".icon-tixing").on("click",function(){$(".modal-overlay-visible").show();$(".modal-tip").show()})$(".dislike-img,.dislike-text").on("click",function(){$(".modal-overlay-visible").show();$(".modal-dislike").show()})$(".dislike-right-li").on("click",function(){var text=$(this).text();$(".dislikeText").val(text)})$(".dialog-dislike-content .send").on("click",function(){var dislikeText=$(".dislikeText").val();if(!dislikeText){$.toast("你没有吐槽任何信息");return}var data={username:UserName,ask_id:AskId,content:dislikeText}$.showPreloader("正在吐槽");$.ajax({type:"POST",data:data,dataType:"json",url:"/ask/debase",success:function(result){$.hidePreloader();console.log(result);if(result.code==200){$.toast("吐槽成功");$(".modal-dislike").hide();$(".modal-overlay-visible").show();$(".modal-dislike-send").show();console.log(result)}else{$.toast("吐槽失败");console.log(result)}},error:function(error){$.hidePreloader();console.log(result)}})})$(".buy").on("click",function(){var buyed=$(".buy").attr("data-buy");if(($(this).text()=="朕已查阅"||$(this).text()=="朕分享的")&&buyed){return}var data={username:UserName,ask_id:AskId}buyed=1;$.showPreloader("正在瞅瞅");$.ajax({type:"GET",data:data,dataType:"json",url:"/authorization/pay",success:function(result){console.log(result);$.hidePreloader();if(result.code==100){$.toast("购买成功");$(".buy").text("朕已查阅");$(".buy").attr("data-buy","1");$(".buyed-img").show();$(".dislike-content").show();getHide({success:function(result){var data=result.data;if(data.shopName){$(".detail-rtname").text(data.shopName)}else{$(".detail-rtname").text("暂无")}if(data.askPosition){var askPosition=JSON.parse(data.askPosition);var address='';for(var key in askPosition){console.log(askPosition[key]);address+=askPosition[key]}$(".detail-address").text(address);$(".detail-address").attr("data-GeoX",data.GeoX);$(".detail-address").attr("data-GeoY",data.GeoY)}},error:function(error){location.reload()}})}else if(result.code==200){initPay(result.payargs);buyed=0}else{$.toast("购买失败");buyed=0}},error:function(error){$.hidePreloader();$.total("网络有问题");console.log(error)}})})function onBridgeReady(payargs){WeixinJSBridge.invoke('getBrandWCPayRequest',{"appId":payargs.appId,"timeStamp":payargs.timeStamp,"nonceStr":payargs.nonceStr,"package":payargs.package,"signType":payargs.signType,"paySign":payargs.paySign},function(res){if(res.err_msg=="get_brand_wcpay_request:ok"){var data={username:UserName,ask_id:AskId}buyed=1;$.showPreloader("正在瞅瞅");getHide({success:function(result){$(".buyed-img").show();$(".dislike-content").show();$.hidePreloader();var data=result.data;if(data.shopName){$(".detail-rtname").text(data.shopName)}else{$(".detail-rtname").text("暂无")}if(data.askPosition){var askPosition=JSON.parse(data.askPosition);var address='';for(var key in askPosition){console.log(askPosition[key]);address+=askPosition[key]}$(".detail-address").text(address);$(".detail-address").attr("data-GeoX",data.GeoX);$(".detail-address").attr("data-GeoY",data.GeoY)}},error:function(error){$.hidePreloader();location.reload()}})}else{}})}function initPay(payargs){if(typeof WeixinJSBridge=="undefined"){if(document.addEventListener){document.addEventListener('WeixinJSBridgeReady',onBridgeReady,false)}else if(document.attachEvent){document.attachEvent('WeixinJSBridgeReady',onBridgeReady);document.attachEvent('onWeixinJSBridgeReady',onBridgeReady)}}else{onBridgeReady(payargs)}}function initPay(payargs){if(typeof WeixinJSBridge=="undefined"){if(document.addEventListener){document.addEventListener('WeixinJSBridgeReady',onBridgeReady,false)}else if(document.attachEvent){document.attachEvent('WeixinJSBridgeReady',onBridgeReady);document.attachEvent('onWeixinJSBridgeReady',onBridgeReady)}}else{onBridgeReady(payargs)}}