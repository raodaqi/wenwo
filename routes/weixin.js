var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('Todo');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  var query = new AV.Query(Todo);
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var token = "wenwo";

  var tmp = new Array(token, timestamp, nonce);

  // $tmpArr = array($token, $timestamp, $nonce);
  // sort($tmpArr, SORT_STRING);
  // $tmpStr = implode( $tmpArr );
  // $tmpStr = sha1( $tmpStr );
  
  // if( $tmpStr == $signature ){
  //   return true;
  // }else{
  //   return false;
  // }
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  var content = req.body.content;
  var todo = new Todo();
  todo.set('content', content);
  todo.save(null, {
    success: function(todo) {
      res.redirect('/todos');
    },
    error: function(err) {
      next(err);
    }
  })
})

module.exports = router;
