/**
 * Created by HanQi on 16/4/15.
 */
var router = require('express').Router();
var AV = require('leanengine');

var Wallet = AV.Object.extend('Wallet');
var User = AV.Object.extend('UserInfo');

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
    // if (!sessionToken) {
    //     var result = {
    //         code : 300,
    //         message : 'miss parameter : session_token'
    //     }
    //     res.send(result);
    //     return;
    // }

    var query = new AV.Query('UserInfo');
    query.equalTo('userName', userName);
    query.find().then(function(results) {
        console.log(results);
        //console.log(results.attributes.wallet);
        // if (!results.attributes.wallet) {
        //     var wallet = new Wallet();
        //     wallet.set('money', 0);
        //     wallet.save();
        //     var query = new AV.Query('UerInfo');
        //     query.get(results.id).then(function(post) {
        //         post.set('wallet', wallet);
        //         post.save();
        //     });
        //
        //
        // }

        res.send(results);
    });

});



module.exports = router;
