/**
 * Created by HanQi on 16/4/15.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Wallet = AV.Object.extend('Wallet');

router.get('/mywallet', function(req, res, next) {
    var sessionToken = req.param('session_token');
    var userName = req.param('username');
    if (!userName) {
        var result = {
            code : 300,
            message : 'miss parameter : username'
        }
        res.send(result);
        return;
    }
    if (!sessionToken) {
        var result = {
            code : 300,
            message : 'miss parameter : session_token'
        }
        res.send(result);
        return;
    }


    console.log(req);
});



module.exports = router;
