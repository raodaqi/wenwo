/**
 * Created by HanQi on 16/4/27.
 */

var router = require('express').Router();
var AV = require('leanengine');

var User = AV.Object.extend('UserInfo');

router.get('/index', function(req, res, next) {
    res.render('manage/index');
});


module.exports = router;
