var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Tag = AV.Object.extend('Test');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  // var post = new Tag();
  // post.save("tagName","123");
  // post.save(null, {
  //   success: function(todo) {
  //     res.redirect('/todos');
  //   },
  //   error: function(err) {
  //     next(err);
  //   }
  // })
  var marker = [];
  for(var i = 0; i < 10; i++){
    var li = {
      id:"marker"+i,
      url:"/img/",
      lng:"104.065"+Math.ceil(1000*Math.random()),
      lat:"30.659"+Math.ceil(1000*Math.random())
    }
    console.log(li);
    marker[i] = li;
  }
  console.log(marker);
});

router.get('/send', function(req, res, next) {
  res.render('send');
});

router.get('/wx', function(req, res, next) {
  AV.Cloud.httpRequest({
    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx99f15635dd7d9e3c&secret=PwwbrWMutl378fjwD5P1IkGZom5zEmXw0Coo7lVDuP6',
    success: function(httpResponse) {
      console.log(httpResponse);
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
  res.render('wx');
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  // var content = req.body.content;
  // var todo = new Todo();
  // todo.set('content', content);
  // todo.save(null, {
  //   success: function(todo) {
  //     res.redirect('/todos');
  //   },
  //   error: function(err) {
  //     next(err);
  //   }
  // })
  var marker = [];
  for(var i = 0; i < 10; i++){
    var li = {
      id:"marker"+i,
      url:"/img/hotPot.jpg",
      // lng:"103.985"+Math.ceil(1000*Math.random()),
      // lat:"30.581"+Math.ceil(1000*Math.random())
      lng:"104.065"+Math.ceil(1000*Math.random()),
      lat:"30.659"+Math.ceil(1000*Math.random())
    }
    console.log(li);
    marker[i] = li;
  }
  for(var i = 10; i < 20; i++){
    var li = {
      id:"marker"+i,
      url:"/img/hotPot.jpg",
      lng:"103.985"+Math.ceil(1000*Math.random()),
      lat:"30.581"+Math.ceil(1000*Math.random())
      // lng:"104.065"+Math.ceil(1000*Math.random()),
      // lat:"30.659"+Math.ceil(1000*Math.random())
    }
    console.log(li);
    marker[i] = li;
  }
  res.send(marker)
  console.log(marker);
})

module.exports = router;
