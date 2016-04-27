/**
 * Created by HanQi on 16/4/27.
 */

var router = require('express').Router();
var AV = require('leanengine');

router.get('/', function(req, res, next) {
    res.render('manage/index');
});


module.exports = router;
