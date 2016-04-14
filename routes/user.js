/**
 * Created by HanQi on 16/4/14.
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var userInfo = AV.Object.extend('UserInfo');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
    AV.User._logInWith('weixin', {
        "authData": {
            "weixin": {
                "openid": "0395BA18A5CD6255E5BA185E7BEBA242",
                "access_token": "12345678-SaMpLeTuo3m2avZxh5cjJmIrAfx4ZYyamdofM7IjU",
                "expires_in": 1382686496
            }
        }
    }).then(function(user) {
        //返回绑定后的用户
        console.log(user);
    }, function(error) {
        console.log(error);
    });
});

// // 新增 Todo 项目
// router.post('/', function(req, res, next) {
//     var content = req.body.content;
//     var todo = new Todo();
//     todo.set('content', content);
//     todo.save(null, {
//         success: function(todo) {
//             res.redirect('/todos');
//         },
//         error: function(err) {
//             next(err);
//         }
//     })
// })

module.exports = router;
