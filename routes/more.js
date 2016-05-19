var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
// var Todo = AV.Object.extend('Todo');

// 查询 Todo 列表
router.get('/order', function(req, res, next) {
  res.render('more/order');
});

router.get('/share', function(req, res, next) {
  res.render('more/share');
});

router.get('/personalPage', function(req, res, next) {
  res.render('more/personalPage');
});
router.get('/moneyBox', function(req, res, next) {
  res.render('more/moneyBox');
});
router.get('/contact-us', function(req, res, next) {
  res.render('more/contact-us');
});
router.get('/purchase-detail/:id', function(req, res, next) {
  var id = req.params.id;
  res.render('more/purchase-detail',{id:id});
});
router.get('/withdraw', function(req, res, next) {
  res.render('more/withdraw');
});
router.get('/watch-us', function(req, res, next) {
  res.render('more/watch-us');
});
router.get('/personal-data', function(req, res, next) {
  res.render('more/personal-data');
});
router.get('/information-presentation', function(req, res, next) {
  res.render('more/information-presentation');
});
router.get('/recharge', function(req, res, next) {
  res.render('more/recharge');
});
router.get('/present-rules', function(req, res, next) {
  res.render('more/present-rules');
});
router.get('/refund', function(req, res, next) {
  res.render('more/refund');
});
router.get('/invite', function(req, res, next) {
  res.render('more/invite');
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
