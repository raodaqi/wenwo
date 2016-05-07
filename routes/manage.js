/**
 * Created by HanQi on 16/4/27.
 */

var router = require('express').Router();
var AV = require('leanengine');

router.get('/', function(req, res, next) {
    res.render('manage/index');
});

router.get('/getviews', function(req, res, next) {
    var query = new AV.Query('Suggestion');
    query.find().then(function (list) {
        console.log(list);
        var result = {
            code : 200,
            data:list,
            message : 'operation successed'
        }
        res.send(result);
    });
});


module.exports = router;
