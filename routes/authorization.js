/**
 * Created by HanQi on 16/5/9.
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象


router.get('/wx', function(req, res, next) {
    var appid = 'wx99f15635dd7d9e3c';
    var secret = '9157e84975386b6dee6a499cc639973e';
    //var url = req.body.url;
    var url = req.rawHeaders[1];
    console.log(url);
    getCode(appid, url, {
        success: function (result) {
            console.log(result);
            //var code = result.data.code;
            
        }
    });
})

function getCode(appid, url, callback) {
    var urlApi = url + "/";
    urlApi = encodeURIComponent(urlApi);
    console.log(urlApi);
    AV.Cloud.httpRequest({
        url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+urlApi+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",
        success: function(httpResponse) {
            // console.log(httpResponse);
            callback.success(httpResponse);
        },
        error: function(httpResponse) {
            console.error('Request failed with response code ' + httpResponse.status);
        }
    });
}

function getAccessToken(code, callback) {
    
}

function getUserInfo() {

}
module.exports = router;
