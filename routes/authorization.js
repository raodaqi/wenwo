/**
 * Created by HanQi on 16/5/9.
 */
var http = require('http');
var router = require('express').Router();
var AV = require('leanengine');

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
    url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';

    res.redirect(url)
});

router.get('/', function(req, res, next) {
    var appid = 'wx99f15635dd7d9e3c';
    var secret = '9157e84975386b6dee6a499cc639973e';

    var code = req.param('code');
    
    getAccessToken(appid, secret, code ,{
        success:function (result) {
            console.log(result);
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

function getUserInfo() {

}
module.exports = router;
