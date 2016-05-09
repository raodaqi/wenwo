/**
 * Created by HanQi on 16/5/9.
 */
var http = require('http');
var router = require('express').Router();
var AV = require('leanengine');
var request = require('request');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象


router.get('/wx', function(req, res, next) {
    var appid = 'wx99f15635dd7d9e3c';
    var secret = '9157e84975386b6dee6a499cc639973e';
    //var url = req.body.url;
    // var url = req.rawHeaders[1];
    // console.log(url);
    // getCode(appid, url, {
    //     success: function (result) {
    //         console.log(result);
    //
    //         // var code = result.data.code;
    //         // getAccessToken(appid,secret,code,{
    //         //     success:function (result) {
    //         //         console.log(result);
    //         //     }
    //         // });
    //
    //     }
    // });
    var urlApi = "http://wenwo.leanapp.cn/authorization/";
    urlApi = encodeURIComponent(urlApi);
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

    res.redirect(url)
});

router.get('/', function(req, res, next) {
    var appid = 'wx99f15635dd7d9e3c';
    var secret = '9157e84975386b6dee6a499cc639973e';

    var code = req.param('code');
    console.log(code);
    
    getAccessToken(appid, secret, code ,{
        success:function (result) {
            //console.log(result);
            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            console.log(accessToken);
            console.log(openid);
            getUserInfo(accessToken,openid,{
                success:function (res) {
                    console.log(res.data);
                    var username = res.data.nickname;
                    var userhead = res.data.headimgurl;
                    var openid = res.data.openid;

                    var data = {
                        username:username,
                        password:openid,
                        userhead:userhead
                    }
                    request.post('../user/regist', {form:data}, function (error, response, body) {
                        console.log(response);
                    });

                }
            });
        }
    });

});

// function getCode(appid, url, callback) {
//
//
//     var urlApi = "http://wenwo.leanapp.cn/authorization/";
//     urlApi = encodeURIComponent(urlApi);
//
//     url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

    // var options = {
    //     hostname: '127.0.0.1',
    //     port: 3000,
    //     path: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect',
    //     method: 'GET'
    // };
    //
    // var req = http.request(options, function (res) {
    //     console.log(res);
    // });


    // console.log(urlApi);
    // AV.Cloud.httpRequest({
    //     url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect',
    //     success: function(httpResponse) {
    //         // console.log(httpResponse);
    //         callback.success(httpResponse);
    //     },
    //     error: function(httpResponse) {
    //         console.error('Request failed with response code ' + httpResponse.status);
    //     }
    // });
//}

function getAccessToken(appid, secret, code, callback) {
    AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+secret+'&code='+code+'&grant_type=authorization_code ',
        success: function(httpResponse) {
            // console.log(httpResponse);
            callback.success(httpResponse);
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
}

function getUserInfo(access_token, openid, callback) {
    AV.Cloud.httpRequest({
        url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
        success: function(httpResponse) {
            // console.log(httpResponse);
            callback.success(httpResponse);
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
}
module.exports = router;
