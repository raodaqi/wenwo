var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
// var Todo = AV.Object.extend('Todo');

function authorize(req, res) {
  var appid = 'wx99f15635dd7d9e3c';
  var secret = '9157e84975386b6dee6a499cc639973e';

  var url = req.originalUrl;
  url = 'http://wenwo.leanapp.cn' + url;
  var urlApi = "http://wenwo.leanapp.cn/authorization/?url="+url;
  urlApi = encodeURIComponent(urlApi);
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+urlApi+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
  res.redirect(url);
}


// 查询 Todo 列表
router.get('/order', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/order',{username:username});
  }
  // res.render('more/order');
});

router.get('/order/test/', function(req, res) {
  var username =  req.query.username;
  // var id = req.params.id;
  res.render('more/order',{username:username});
});

router.get('/share', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/share',{username:username});
  }
  // res.render('more/share');
});

router.get('/share/test/', function(req, res) {
  var username =  req.query.username;
  // var id = req.params.id;
  res.render('more/share',{username:username});
});

router.get('/personalPage', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/personalPage',{username:username});
  }

router.get('/personalPage/test/', function(req, res) {
  var username =  req.query.username;
  // var id = req.params.id;
  res.render('more/personalPage',{username:username});
});

  // res.render('more/personalPage');
});
router.get('/moneyBox', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/moneyBox',{username:username});
  }
  // res.render('more/moneyBox');
});

router.get('/moneyBox/test', function(req, res, next) {
  var username =  req.query.username;
  res.render('more/moneyBox',{username:username});
  // res.render('more/moneyBox');
});

router.get('/contact-us', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/contact-us',{username:username});
  }
  // res.render('more/contact-us');
});
router.get('/purchase-detail/:id', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    var id = req.params.id;
    res.render('more/purchase-detail',{id:id,username:username});
  }
  // var id = req.params.id;
  // res.render('more/purchase-detail',{id:id});
});
router.get('/purchase-detail/test/:id', function(req, res) {
  var username =  req.query.username;
  var id = req.params.id;
  res.render('more/purchase-detail',{id:id,username:username});
});
router.get('/withdraw', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/withdraw',{username:username});
  }
  // res.render('more/withdraw');
});
router.get('/watch-us', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/watch-us',{username:username});
  }
  // res.render('more/watch-us');
});
router.get('/personal-data', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/personal-data',{username:username});
  }
  // res.render('more/personal-data');
});
router.get('/information-presentation/:id', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    var id = req.params.id;
    res.render('more/information-presentation',{id:id,username:username});
  }
  // var id = req.params.id;
  // res.render('more/information-presentation',{id:id});
});
router.get('/information-presentation/test/:id', function(req, res) {
  var username =  req.query.username;
  var id = req.params.id;
  res.render('more/information-presentation',{id:id,username:username});
});

router.get('/askdetail/:id', function(req, res, next) {
  // authorize(req,res);
  // var id = req.params.id;
  // res.render('more/askDetail',{id:id});
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    var id = req.params.id;
    res.render('more/askDetail',{id:id,username:username});
  }
});
router.get('/askdetail/test/:id', function(req, res) {
  // authorize(req,res);
  var username =  req.query.username;
  var id = req.params.id;
  res.render('more/askDetail',{id:id,username:username});
});

router.get('/recharge', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/recharge',{username:username});
  }
  // res.render('more/recharge');
});

router.get('/recharge/test', function(req, res, next) {

  var username =  req.query.username;
  res.render('more/recharge',{username:username});

});

router.get('/present-rules', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/present-rules',{username:username});
  }
  // res.render('more/present-rules');
});
router.get('/refund', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/refund',{username:username});
  }
  // res.render('more/refund');
});
router.get('/invite', function(req, res, next) {
  var user = AV.User.current();
  if(!user){
    authorize(req, res);
  }else{
    var username = user.get('user');
    res.render('more/invite',{username:username});
  }
  // res.render('more/invite');
});
router.get('/invite/test', function(req, res, next) {
  var username =  req.query.username;
  res.render('more/invite',{username:username});
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
