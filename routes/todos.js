var router = require('express').Router();
var AV = require('leanengine');
var jsSHA = require('jssha');
var sha1 = require('sha1');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Tag = AV.Object.extend('Test');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  // var post = new Tag();
  // post.save("tagName","123");
  // post.save(null, {
  //   success: function(todo) {
  //     res.redirect('/todos');
  //   },
  //   error: function(err) {
  //     next(err);
  //   }
  // })
  var marker = [];
  for(var i = 0; i < 10; i++){
    var li = {
      id:"marker"+i,
      url:"/img/",
      lng:"104.065"+Math.ceil(1000*Math.random()),
      lat:"30.659"+Math.ceil(1000*Math.random())
    }
    console.log(li);
    marker[i] = li;
  }
  console.log(marker);
});

router.get('/send', function(req, res, next) {
  res.render('send');
});

function getAccessToken(appid,secret,callback){
  AV.Cloud.httpRequest({
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret,
    success: function(httpResponse) {
      // console.log(httpResponse);
      callback.success(httpResponse);
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
}

//设置缓存
var cachedSignatures = {};

// 2小时后过期，需要重新获取数据后计算签名
var expireTime = 7200 - 100;

// noncestr
var createNonceStr = function() {
  return Math.random().toString(36).substr(2, 15);
};

// timestamp
var createTimeStamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

// 输出数字签名对象
var responseWithJson = function (res, data) {
    // 允许跨域异步获取
    // res.set({
    //   "Access-Control-Allow-Origin": "*"
    //   ,"Access-Control-Allow-Methods": "POST,GET"
    //   ,"Access-Control-Allow-Credentials": "true"
    // });
    // res.json(data);
     // res.render('wxtest',{data:data});
  };

router.get('/wx', function(req, res, next) {
  // var appid = "wx99f15635dd7d9e3c";
  // var secret = "9157e84975386b6dee6a499cc639973e";
  // var url = req.body.url;
  // var signatureObj = cachedSignatures[url];
  // // var url = "http://wenwo.leanapp.cn/todos/wx";

  // // 如果缓存中已存在签名，则直接返回签名
  //   if(signatureObj && signatureObj.timestamp){
  //     var t = createTimeStamp() - signatureObj.timestamp;
  //     console.log(signatureObj.url, url);
  //     // 未过期，并且访问的是同一个地址
  //     // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
  //     if(t < expireTime && signatureObj.url == url){
  //       console.log('======== result from cache ========');
  //       // var results = {
  //       //     noncestr: signatureObj.noncestr,
  //       //     timestamp: signatureObj.timestamp,
  //       //     appid: signatureObj.appid,
  //       //     signature: signatureObj.signature,
  //       //     url: signatureObj.url
  //       //   }
  //       //  var result = {
  //       //     code : 200,
  //       //     signature : results
  //       // }
  //       // res.send(result);
  //       return responseWithJson(res, {
  //         nonceStr: signatureObj.nonceStr
  //         ,timestamp: signatureObj.timestamp
  //         ,appid: signatureObj.appid
  //         ,signature: signatureObj.signature
  //         ,url: signatureObj.url
  //       });
  //     }
  //     // 此处可能需要清理缓存当中已过期的数据
  //   }
  // getAccessToken(appid,secret,{
  //   success:function(result){
  //     var access_token = result.data.access_token;
  //     AV.Cloud.httpRequest({
  //       url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi',
  //       success: function(httpResponse) {
  //         // console.log(httpResponse);
  //         var ticket = httpResponse.data.ticket;
  //         // callback.success(httpResponse);
          
  //          var noncestr = createNonceStr();
  //          var timestamp = createTimeStamp();
  //          var calcSignature = function (ticket, noncestr, ts, url) {
  //            var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
  //            // shaObj = new jsSHA(str, 'TEXT');
  //            // return shaObj.getHash('SHA-1', 'HEX');
  //            return sha1(str);
  //           }

  //           var signature = calcSignature(ticket, noncestr, timestamp, url);

  //           cachedSignatures[url] = {
  //             noncestr: noncestr,
  //             appid: appid,
  //             timestamp: timestamp,
  //             signature: signature,
  //             url: url
  //           };
  //           // responseWithJson(res, {
  //           //   noncestr: noncestr,
  //           //   appid: appid,
  //           //   timestamp: timestamp,
  //           //   signature: signature,
  //           //   url: url
  //           // });
  //           var data = {
  //             noncestr: noncestr,
  //             appid: appid,
  //             timestamp: timestamp,
  //             signature: signature,
  //             url: url
  //           };
  //           console.log(data);
  //         res.render('wxtest',{data:data});
  //         return;

  //           // console.log(signature);
  //       },
  //       error: function(httpResponse) {
  //         console.error('Request failed with response code ' + httpResponse.status);
  //       }
  //     });
  //     console.log(result.data);
  //   }
  // })
  res.render('wx');
});

router.get('/test/wx', function(req, res, next) {
  var appid = "wx99f15635dd7d9e3c";
  var secret = "9157e84975386b6dee6a499cc639973e";
  var url = req.originalUrl;
  url = "http://wenwo.leanapp.cn/todos/test/wx";
  // console.log(req);
  var signatureObj = cachedSignatures[url];
  // var url = "http://wenwo.leanapp.cn/todos/wx";

  // 如果缓存中已存在签名，则直接返回签名
    if(signatureObj && signatureObj.timestamp){
      var t = createTimeStamp() - signatureObj.timestamp;
      console.log(signatureObj.url, url);
      // 未过期，并且访问的是同一个地址
      // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
      if(t < expireTime && signatureObj.url == url){
        console.log('======== result from cache ========');
        // var results = {
        //     noncestr: signatureObj.noncestr,
        //     timestamp: signatureObj.timestamp,
        //     appid: signatureObj.appid,
        //     signature: signatureObj.signature,
        //     url: signatureObj.url
        //   }
        //  var result = {
        //     code : 200,
        //     signature : results
        // }
        // res.send(result);
        // return responseWithJson(res, {
        //   nonceStr: signatureObj.nonceStr
        //   ,timestamp: signatureObj.timestamp
        //   ,appid: signatureObj.appid
        //   ,signature: signatureObj.signature
        //   ,url: signatureObj.url
        // });
        var data = {
          noncestr: signatureObj.noncestr
          ,timestamp: signatureObj.timestamp
          ,appid: signatureObj.appid
          ,signature: signatureObj.signature
          ,url: signatureObj.url
        };
        console.log(data);
        res.render('wxtest',{data:data});
        return;
      }
      // 此处可能需要清理缓存当中已过期的数据
    }
  getAccessToken(appid,secret,{
    success:function(result){
      var access_token = result.data.access_token;
      AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi',
        success: function(httpResponse) {
          // console.log(httpResponse);
          var ticket = httpResponse.data.ticket;
          // callback.success(httpResponse);
          
           var noncestr = createNonceStr();
           var timestamp = createTimeStamp();
           var calcSignature = function (ticket, noncestr, ts, url) {
             var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
             // shaObj = new jsSHA(str, 'TEXT');
             // return shaObj.getHash('SHA-1', 'HEX');
             return sha1(str);
            }

            var signature = calcSignature(ticket, noncestr, timestamp, url);

            cachedSignatures[url] = {
              noncestr: noncestr,
              appid: appid,
              timestamp: timestamp,
              signature: signature,
              url: url
            };
            responseWithJson(res, {
              noncestr: noncestr,
              appid: appid,
              timestamp: timestamp,
              signature: signature,
              url: url
            });

            // console.log(signature);
        },
        error: function(httpResponse) {
          console.error('Request failed with response code ' + httpResponse.status);
        }
      });
      console.log(result.data);
    }
  })
  // res.render('wxtest');
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  // var content = req.body.content;
  // var todo = new Todo();
  // todo.set('content', content);
  // todo.save(null, {
  //   success: function(todo) {
  //     res.redirect('/todos');
  //   },
  //   error: function(err) {
  //     next(err);
  //   }
  // })
  var marker = [];
  for(var i = 0; i < 10; i++){
    var li = {
      id:"marker"+i,
      url:"/img/hotPot.jpg",
      // lng:"103.985"+Math.ceil(1000*Math.random()),
      // lat:"30.581"+Math.ceil(1000*Math.random())
      lng:"104.065"+Math.ceil(1000*Math.random()),
      lat:"30.659"+Math.ceil(1000*Math.random())
    }
    console.log(li);
    marker[i] = li;
  }
  for(var i = 10; i < 20; i++){
    var li = {
      id:"marker"+i,
      url:"/img/hotPot.jpg",
      lng:"103.985"+Math.ceil(1000*Math.random()),
      lat:"30.581"+Math.ceil(1000*Math.random())
      // lng:"104.065"+Math.ceil(1000*Math.random()),
      // lat:"30.659"+Math.ceil(1000*Math.random())
    }
    console.log(li);
    marker[i] = li;
  }
  res.send(marker)
  console.log(marker);
})

module.exports = router;
