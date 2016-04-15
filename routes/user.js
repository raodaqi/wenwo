/**
 * Created by HanQi on 16/4/14.
 */
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Post = AV.Object.extend('UserInfo');

// 查询 Todo 列表
router.get('/regist', function(req, res, next) {
    var post = new Post();

    console.log(req.param('id'));
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
