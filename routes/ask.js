/**
 * Created by HanQi on 16/4/15.
 */

var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var User = AV.Object.extend('UserInfo');
var Ask =  AV.Object.extend('AskMe');

router.get('/allask', function(req, res, next) {
    //page      size
});
router.get('/myask', function(req, res, next) {
    var sessionToken = req.param('session_token');
    var userName = req.param('username');
    var staus = req.param('staus');
    /**
     * staus == 1   与我相关的ask
     * staus == 2   我上架的ask
     * staus == 3   我审批中ask
     * staus == 4   我未上架ask
     */
});




module.exports = router;
