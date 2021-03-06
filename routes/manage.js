/**
 * Created by HanQi on 16/4/27.
 */

var router = require('express').Router();
var AV = require('leanengine');
var Admin = AV.Object.extend('AdminAccount');
var schedule = require("node-schedule");
var qiniu = require("qiniu");

//添加本地数据库
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//连接数据库
var url = 'mongodb://localhost:27017/wenwo';
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   db.close();
// });


//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'DU0ZyfvC06whs4kFM65I4uGlnDkCeyLMV6ct4NPF';
qiniu.conf.SECRET_KEY = 'wvt3V7LrhJi6sPefoL1mRB3PsRV_KUUucd3QNmAz';


router.get('/token', function(req, res) {
 
  var uptoken = new qiniu.rs.PutPolicy("wenwo");

  var token = uptoken.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});

router.get('/edit', function(req, res) {
  var type = req.query.type;
  var askid = req.query.askid;
  var username =  req.query.username;

  if(username){
    res.render('manage/edit', {username:username,type:type,askid:askid});
    return ;
  }

  var user = AV.User.current();
  if (!user) {
    authorize(req, res);
  }else{
    var username = user.get('user');
    // console.log(username);
    res.render('manage/edit', {username:username,type:type,askid:askid});
  }
});

router.get('/asklist', function(req, res) {

    res.render('manage/asklist');

});

//查找活跃人数
var getLookUser = function(db, callback) {
    var userklook = db.collection('UserLook').find();
    userklook.count(function(err, count) {
      assert.equal(err, null);
      if (err) {
        var result = {
            code     : 400,
            message  : err 
        }
        callback(result);
        
      } else {
        var result = {
            code     : 200,
            data     : count,
            message  : "success" 
         }
         callback(result);
      }
   });
}

//添加活跃人数
var addLookUser = function(db,data, callback) {

    var username = data.username;
    if(!username || username.length < 6 || username == null){
        var result = {
            code    : 400,
            message : "username illegal"
        }
        callback(result);
        return;
    }
    var userklook = db.collection('UserLook').find({ "username": username });
    userklook.count(function(err, count) {
      assert.equal(err, null);
      if(err){
        var result = {
            code    : 400,
            message : "query error"
        }
        callback(result);
        return;
      }

      if (count) {
        var result = {
            code    : 600,
            message : "username exit"
        }
        callback(result);
      } else {
        //数据为空
        //添加数据
        db.collection('UserLook').insertOne(data, function(err, result) {
            assert.equal(err, null);
            if(err){
                var result = {
                    code    : 400,
                    message : "insert error"
                }
            }else{
                var result = {
                    code    : 200,
                    message : "success"
                }
            }
            callback(result);
        });
    }
   });
}

//清空数据
var removeLookUser = function() {
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
        db.collection('UserLook').deleteMany( {}, function(err, results) {
            if (err) {
                var result = {
                    code     : 400,
                    message  : err 
                }
                console.log(result);
                
            } else {
                var result = {
                    code     : 200,
                    message  : "success" 
                }
                 console.log(result);
            }
              db.close();
        });
    });
};

//查找
var getContact = function(db, callback) {
    var Contact = db.collection('Contact').find({}, {sort: {'createAt': -1}});
    Contact.toArray(function(err, contactList) {
      assert.equal(err, null);
      if (err) {
        var result = {
            code     : 400,
            message  : err 
        }
        callback(result); 
      } else {
        var result = {
            code     : 200,
            data     : contactList,
            message  : "success" 
         }
         callback(result);
      }
   });
}

//添加下载联系方式
var addContact = function(db,data, callback) {

    var contact = data.contact;
    var Contact = db.collection('Contact').find({ "contact": contact });
    Contact.count(function(err, count) {
      assert.equal(err, null);
      if(err){
        var result = {
            code    : 400,
            message : "query error"
        }
        callback(result);
        return;
      }

      if (count) {
        var result = {
            code    : 600,
            message : "username exit"
        }
        callback(result);
      } else {
        //数据为空
        //添加数据
        db.collection('Contact').insertOne(data, function(err, result) {
            assert.equal(err, null);
            if(err){
                var result = {
                    code    : 400,
                    message : "insert error"
                }
            }else{
                var result = {
                    code    : 200,
                    message : "success"
                }
            }
            callback(result);
        });
    }
   });
}

router.get('/addContact', function(req, res) {
    var contact = req.query.contact;
    var createAt = new Date().getTime();
    var data = {
        contact : contact,
        createAt : createAt
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      addContact(db,data,function(result) {
        res.send(result);
        db.close();
      });
    });
});

router.get('/getContact', function(req, res) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      getContact(db, function(result) {
        res.send(result);
        db.close();
      });
    });
});

router.get('/addlookuser', function(req, res) {
    console.log(req.connection.remoteAddress);
    var username = req.query.username;
    var data = {
        username : username
    }
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      addLookUser(db,data,function(result) {
        res.send(result);
        db.close();
      });
    });
});

router.get('/getlookuser', function(req, res) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      getLookUser(db, function(result) {
        res.send(result);
        db.close();
      });
    });
});

router.get('/getmanagedata', function(req, res) {
 
  var query = new AV.Query('ManageData');
  query.ascending('createdAt');
  query.find().then(function (results) {
    var result = {
        code : 200,
        data : results,
        message : "success"
    }
    res.send(result);
  }, function (error) {
    var result = {
        code : 400,
        message : "error"
    }
    res.send(result);
  });
});

router.get('/version', function(req, res) {
    var query = new AV.Query('ApkVersion');
    query.descending('versionCode');
    query.first().then(function (resultes) {
        var result = {
            code : 200,
            message : 'success',
            data:resultes
        }
        res.send(result);
    },function(error){
        var result = {
            code : 500,
            message : 'error',
            data:''
        }
        res.send(result);
    });
});

router.get('/', function(req, res, next) {
    var user = AV.User.current();

    if(!user){
        res.redirect('manage/signin');
    }else{
        var username = user.get('username');
        // console.log(username);
        res.render('manage/index',{username:username});
    }
    // res.render('manage/index');
});


router.get('/signin', function(req, res, next) {
    res.render('manage/signin');
});

// router.get('/signup', function(req, res, next) {
//     res.render('manage/signup');
// });

router.post('/regist', function(req, res, next) {
    var adminName = req.param('name');
    var password = req.param('password');

    if (adminName == '' || adminName == null) {
        var result = {
            code : 400,
            message : '缺少参数name'
        }
        res.send(result);
        return;
    }
    if (password == '' || password == null) {
        var result = {
            code : 400,
            message : '缺少参数password'
        }
        res.send(result);
        return;
    }
    // var query = new AV.Query('AdminAccount');
    // query.find().then(function (resultes) {
    //     for (var i = 0; i < resultes.length; i++) {
    //         if (resultes[i].get('adminName') == adminName) {
    //             var result = {
    //                 code : 600,
    //                 message : '该用户名已经被注册'
    //             }
    //             res.send(result);
    //             return;
    //         }
    //     }
    //     var account = new Admin();
    //     account.set('adminName', adminName);
    //     account.set('password', password);
    //     account.save().then(function (account) {
    //         var result = {
    //             code : 200,
    //             message : '操作成功'
    //         }
    //         res.send(result);
    //         return;
    //     });
    // });
    var user = new AV.User();
    user.set('username', adminName);
    user.set('password', password);
    //user.set('email', 'hang@leancloud.rocks');

// other fields can be set just like with AV.Object
    //user.set('phone', '186-1234-0000');
    user.signUp().then(function(user) {
        // 注册成功，可以使用了
        // console.log(user);
        var result = {
            code : 200,
            user:user,
            message : '操作成功'
        }
        res.send(result);
        return;
    }, function(error) {
        // 失败了
        // console.log('Error: ' + error.code + ' ' + error.message);
        var result = {
            code : 400,
            message : error.message
        }
        res.send(result);
    });
});

router.post('/login', function (req, res, next) {
    var name = req.param('name');
    var password = req.param('password');
    if (name == '' || name == null) {
        var result = {
            code : 400,
            message : '缺少参数name'
        }
        res.send(result);
        return;
    }
    if (password == '' || password == null) {
        var result = {
            code : 400,
            message : '缺少参数password'
        }
        res.send(result);
        return;
    }
    // var query = new AV.Query('AdminAccount');
    // query.find().then(function (resultes) {
    //     for (var i = 0; i < resultes.length; i++ ) {
    //         if (resultes[i].get('adminName') == name && resultes[i].get('password') == password) {
    //             var result = {
    //                 code : 200,
    //                 user : resultes[i],
    //                 message : '登录成功'
    //             }
    //             res.send(result);
    //             return;
    //         }
    //     }
    //     var result = {
    //         code : 400,
    //         message : '用户名或密码错误'
    //     }
    //     res.send(result);
    //     return;
    // });
    AV.User.logIn(name, password).then(function() {
        // 成功了，现在可以做其他事情了
        var user = AV.User.current();
        var result = {
            code : 200,
            user:user,
            message : '操作成功'
        }
        res.send(result);
    }, function() {
        // 失败了
        var result = {
            code : 400,
            message : '登录失败'
        }
        res.send(result);
    });
});

router.get('/getviews', function(req, res, next) {
    var query = new AV.Query('Suggestion');
    query.find().then(function (list) {
        // console.log(list);
        var result = {
            code : 200,
            data:list,
            message : 'operation successed'
        }
        res.send(result);
    });
});

router.get('/getapply', function(req, res, next) {
    var query = new AV.Query('Apply');
    query.addAscending('updatedAt');
    query.find().then(function (applys) {
        var result = {
            code : 200,
            data: applys,
            message : 'operation successed'
        }
        res.send(result);
    });
});

function formatDate(format, timestamp, full) {
    format = format.toLowerCase();
    if (!format) format = "y-m-d h:i:s";

    function zeroFull(str) {
        // console.log(full);
        // return full ? (str >= 10 ? str : ('0' + str)) : str;
        return (str >= 10 ? str : ('0' + str));
    }
    var time = new Date(timestamp),
        o = {
            y: time.getFullYear(),
            m: zeroFull(time.getMonth() + 1),
            d: zeroFull(time.getDate()),
            h: zeroFull(time.getHours()),
            i: zeroFull(time.getMinutes()),
            s: zeroFull(time.getSeconds())
        };
    return format.replace(/([a-z])(\1)*/ig, function(m) {
        return o[m];
    });
};   

function getManageData(callback){
    var userNum,
        askNum,
        havedNum,
        buyNum,
        deleteNum;

    var query = new AV.Query('UserInfo');
    query.count().then(function (count) {
        // console.log(count);
        //保存用户数量
        userNum = count;

        var query = new AV.Query('AskMe');
        query.count().then(function (count) {
            // console.log(count);
            //ask的数量
            askNum = count;
            var query = new AV.Query('Haved');
            query.count().then(function (count) {
                // console.log(count);
                //ask的数量
                havedNum = count;
                var query = new AV.Query('Haved');
                query.exists('income');
                query.count().then(function (count) {
                    // console.log(count);
                    //ask的数量
                    buyNum = count;
                    var query = new AV.Query('AskMe');
                    query.equalTo('staus', "6");
                    query.count().then(function (count) {
                        // console.log(count);
                        //ask的数量
                        deleteNum = count;
                        var data = {
                            userNum   : userNum,
                            askNum    : askNum,
                            havedNum  : havedNum,
                            buyNum    : buyNum,
                            deleteNum : deleteNum
                        }
                        callback.success(data);
                        // var result = {
                        //     code : 200,
                        //     data : data,
                        //     message : "success"
                        // }
                        // res.send(result);
                    });
                });
            });
        });
    });
}

function saveToday(lookUserNum){
    getManageData({
        success:function(data){
            var date = new Date();
            date = formatDate("y-m-d",date);
            // console.log(date);
            var query = new AV.Query('ManageData');
            query.equalTo('today', date);
            query.first().then(function (result) {
                // data 就是符合条件的第一个 AV.Object
                // console.log(result);
                if(!result){
                    var ManageData = AV.Object.extend('ManageData');
                    var manageData = new ManageData();
                      // 设置名称
                        manageData.set('userNum',data.userNum);
                        if(lookUserNum){
                            lookUserNum = parseInt(lookUserNum);
                            manageData.set('lookUserNum',lookUserNum); 
                        }
                        manageData.set('askNum',data.askNum);
                        manageData.set('havedNum',data.havedNum);
                        manageData.set('buyNum',data.buyNum);
                        manageData.set('deleteNum',data.deleteNum);
                        manageData.set('today',date);
                        manageData.save().then(function (manageData) {
                            // console.log('objectId is ' + todo.id);
                            // console.log(manageData);
                        }, function (error) {
                            console.log(error);
                        });
                }
              }, function (error) {
            });
        }
    })
}

router.get('/deletedata', function(req, res, next) {
    var priorityQuery = new AV.Query('Haved');
    priorityQuery.equalTo('byName', "彭勇");

    var statusQuery = new AV.Query('Haved');
    statusQuery.equalTo('byName', "天凉好个秋");

    query = AV.Query.or(priorityQuery, statusQuery);
    query.find().then(function (results) {
        AV.Object.destroyAll(results).then(function (avobjs) {
          var result = {
            code : 200,
            message:"success"
          }
          res.send(result);
        }, function (error) {
          var result = {
            code : 400,
            message:"error"
          }
          res.send(result);
        });
    }, function (error) {
        var result = {
            code : 400,
            message:"error"
          }
        res.send(result);
    });
})

router.get('/getdata', function(req, res, next) {
    var userNum,
        askNum,
        havedNum,
        buyNum,
        lookUserNum,
        deleteNum;

    var query = new AV.Query('UserInfo');
    query.count().then(function (count) {
        //保存用户数量
        userNum = count;

        var query = new AV.Query('AskMe');
        query.count().then(function (count) {
            //ask的数量
            askNum = count;
            var query = new AV.Query('Haved');
            query.count().then(function (count) {
                // console.log(count);
                //ask的数量
                havedNum = count;
                var query = new AV.Query('Haved');
                query.exists('income');
                query.count().then(function (count) {
                    //ask的数量
                    buyNum = count;
                    var query = new AV.Query('AskMe');
                    query.equalTo('staus', "6");
                    query.count().then(function (count) {
                        //ask的数量
                        deleteNum = count;
                        MongoClient.connect(url, function(err, db) {
                          assert.equal(null, err);
                          getLookUser(db, function(result) {
                            lookUserNum = parseInt(result.data);
                            var data = {
                                userNum     : userNum,
                                askNum      : askNum,
                                havedNum    : havedNum,
                                buyNum      : buyNum,
                                deleteNum   : deleteNum,
                                lookUserNum : lookUserNum
                            }
                            // saveToday(data);
                            var query = new AV.Query('ManageData');
                            query.descending('createdAt');
                            query.limit(2);// 最多返回 2 条结果
                            query.find().then(function (results) {
                                var result = {
                                    code : 200,
                                    data : data,
                                    dayData :  results,
                                    message : "success"
                                }
                                res.send(result);
                            })
                            db.close();
                          });
                        });
                    });
                });
            });
        });
    });
});

router.get('/applyinfo', function(req, res, next) {
    // var user = AV.User.current();
    // if (user == null || user == '') {
    //     var result = {
    //         code : 300,
    //         message : '用户未登录'
    //     };
    //     res.send(result);
    //     return;
    // }
    // var applyId = req.query.apply_id;
    // var staus = req.query.staus; //staus = 0 未处理  = 1 通过  =2 失败
    // var query = new AV.Query('Apply');
    // query.get(applyId).then(function (apply) {
    //     apply.set('staus', staus);
    //     apply.set('operationBy', user.get('username'));
    //     apply.save().then(function (apply) {
    //         if (staus == '2') {
    //             var result = {
    //                 code : 200,
    //                 data: apply,
    //                 message : 'operation successed'
    //             }
    //             res.send(result);
    //         }
    //         else if (staus == '1') {
    //
    //         }
    //     });
    // })

    var userName = req.query.username;
    var amount = req.query.amount;

    //var applyId = req.query.apply_id;
    //var query = new AV.Query('Apply');
    //query.get(applyId).then(function (apply) {
        //var userName = apply.get('userName');
        //var amount = apply.get('amount');
    // console.log(userName);
    // console.log(amount);


        // var query = new AV.Query('AskMe');
        // query.equalTo('createBy', userName);
        // query.find().then(function (resultes) {
        //     var totalGet = 0;
        //     for (var i = 0; i < resultes.length; i++) {
        //         totalGet += (parseFloat(resultes[i].get('askPrice')) * parseInt(resultes[i].get('buyNum')));
        //     }
        //     console.log('tatalGet:' + totalGet);
        //     var query = new AV.Query('Haved');
        //     query.equalTo('by', userName);
        //     query.find().then(function (haved) {
        //         var totalHaved = 0;
        //         for (var i = 0; i < haved.length; i++) {
        //             totalHaved += parseFloat(haved[i].get('price'));
        //         }
        //         console.log('totalHaved:' + totalHaved);
        //         var query = new AV.Query('Withdraw');
        //         query.equalTo('userName', userName);
        //         query.find().then(function (withdraw) {
        //             var withdrawTotal = 0;
        //             for (var i = 0; i < withdraw.length; i++) {
        //                 withdrawTotal += parseFloat(withdraw[i].get('amount')/100);
        //             }
        //             console.log('withdrawTotal:' + withdrawTotal);
        //             var data = {
        //                 totalGet : parseFloat(totalGet).toFixed(2),
        //                 totalHaved : parseFloat(totalHaved).toFixed(2),
        //                 withdrawTotal : parseFloat(withdrawTotal).toFixed(2),
        //                 thisWithdraw : parseFloat(parseFloat(amount) / 100).toFixed(2)
        //             }
        //             var result = {
        //                 code : 200,
        //                 data: data,
        //                 message : 'operation successed'
        //             }
        //             res.send(result);
        //         });
        //     });
        // });


        var query = new AV.Query('Haved');
        query.equalTo('askOwn', userName);
        query.limit(1000);
        query.find().then(function (saleList) {
            var query = new AV.Query('Haved');
            query.equalTo('by', userName);
            query.limit(1000);
            query.find().then(function (buyList) {
                var query = new AV.Query('Order');
                query.equalTo('userName', userName);
                query.limit(1000);
                query.find().then(function (payList) {
                    var query = new AV.Query('Withdraw');
                    query.equalTo('userName', userName);
                    query.limit(1000);
                    query.find().then(function (withdrawList) {
                        var data = {
                            saleList:saleList,
                            buyList:buyList,
                            payList:payList,
                            withdrawList:withdrawList
                        };
                        var result = {
                            code : 200,
                            data: data,
                            message : 'operation successed'
                        }
                        res.send(result);
                    });
                });
            });
        });



    //});

});

router.get('/apply', function(req, res, next) {
    var user = AV.User.current();
    if (user == null || user == '') {
        var result = {
            code : 300,
            message : '用户未登录'
        };
        res.send(result);
        return;
    }
    var applyId = req.query.apply_id;
    var staus = req.query.staus; //staus = 0 未处理  = 1 通过  =2 失败
    var query = new AV.Query('Apply');
    query.get(applyId).then(function (apply) {
        apply.set('staus', staus);
        apply.set('operationBy', user.get('username'));
        apply.save().then(function (apply) {
            if (staus == '2') {
                var result = {
                    code : 200,
                    data: apply,
                    message : 'operation successed'
                }
                res.send(result);
            }
            else if (staus == '1') {
                var secret = '9157e84975386b6dee6a499cc639973e';
                var username = apply.get('userName');
                var amount = apply.get('amount');
                // console.log(amount);
                // if (code == null) {
                //     var urlApi = "http://wenwo.leanapp.cn/authorization/withdraw?amount="+amount+"&username="+username;
                //     //var urlApi = "/authorization/pay_t";
                //     authorize(res, urlApi);
                //     return;
                // }
                // var user = AV.User.current();
                // if (user == null || user == '') {
                //     var result = {
                //         code : 300,
                //         message : '用户未登录'
                //     }
                //     res.send(result);
                //     return;
                // }
                //else {
                var query = new AV.Query('Apply');
                query.equalTo('user', username);
                query.first().then(function (user) {
                    var authData = user.get('authData');
                    var openid = authData.weixin.openid;
                    var accessToken = authData.weixin.access_token;
                    var expiresIn = authData.weixin.expires_in;
                    var query = new AV.Query('Config');
                    var id = '5745403d49830c006265dacb';
                    query.get(id).then(function (commission) {
                        //for (var i = 0; i < configs.length; i++) {
                        //if (configs[i].get('name') == 'commission') {
                        //var commission = parseInt(configs[i].get('value'));
                        //var amount = 1;
                        var query = new AV.Query('UserInfo');
                        query.equalTo('userName', username);
                        query.find().then(function(results) {
                            if (results[0] == '' || results[0] == null) {
                                var result = {
                                    code : 300,
                                    message : '未找到该用户'
                                };
                                res.send(result);
                                return;
                            }
                            else {
                                var reamount = parseInt(amount) - parseInt(amount)*parseInt(commission.get('value'))/100;
                                var id = results[0].attributes.wallet.id;
                                var query = new AV.Query('Wallet');
                                query.get(id).then(function (wallet) {
                                    var money = wallet.get('money');
                                    if (parseFloat(money) < parseFloat(amount)/100) {
                                        var result = {
                                            code : 700,
                                            message : '余额不足'
                                        };
                                        res.send(result);
                                        return;
                                    }
                                    else {
                                        // amount = parseFloat(amount);
                                        // amount = amount * 100;
                                        var date = new Date();
                                        date = moment(date).format("YYYYMMDDHHmmss");
                                        var str = date + getNonceStr(10);

                                        var appid = 'wx99f15635dd7d9e3c';
                                        var mchid = '1298230401';
                                        var nonceStr = getNonceStr();
                                        //var sign = getSign();
                                        var partnerTradeNo = str;
                                        //var openid = '';
                                        var checkName = 'NO_CHECK';

                                        var desc = '提现';
                                        var ip = req.ip;
                                        ip = ip.substr(ip.lastIndexOf(':')+1, ip.length);
                                        //var codeData = result.data;
                                        // codeData = JSON.parse(codeData);
                                        // var accessToken = codeData.access_token;
                                        // var openid = codeData.openid;
                                        // var expiresIn = codeData.expires_in;

                                        var data = {
                                            mch_appid : appid,
                                            mchid : mchid,
                                            nonce_str : nonceStr,
                                            partner_trade_no : partnerTradeNo,
                                            openid : openid,
                                            check_name : checkName,
                                            amount : reamount,
                                            desc : desc,
                                            spbill_create_ip : ip
                                        };
                                        data.sign = getSign(data);

                                        // console.log(data);
                                        //console.log(buildXML(data));
                                        //return;
                                        // getAccessToken(appid, secret, code, res, {
                                        //     success:function (result) {

                                        request({
                                            url: "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
                                            method: 'POST',
                                            body: buildXML(data),
                                            agentOptions: {
                                                pfx: fs.readFileSync('./routes/certificate/apiclient_cert.p12'),
                                                passphrase: mchid
                                            }
                                        }, function(err, response, body){
                                            //console.log(err)
                                            //console.log(response);
                                            // console.log(body);
                                            parseXML(body, function (err, result) {
                                                // console.log(result);
                                                if (result.return_code == 'SUCCESS' && result.return_msg == '') {
                                                    var withdraw = new Withdraw();
                                                    withdraw.set('nonceStr', result.nonce_str);
                                                    withdraw.set('partnerTradeNo', result.partner_trade_no);
                                                    withdraw.set('paymentNo', result.payment_no);
                                                    withdraw.set('paymentTime', result.payment_time);
                                                    withdraw.set('userName', username);
                                                    withdraw.set('amount', amount);
                                                    withdraw.save().then(function (post) {
                                                        //wallet.set('money', parseFloat(parseFloat(money) - parseFloat(amount)/100));
                                                        //wallet.save().then(function (wallet) {
                                                            var result = {
                                                                code : 200,
                                                                data : wallet,
                                                                message : 'Operation succeeded'
                                                            };
                                                            res.send(result);
                                                        //});

                                                    });
                                                }
                                                else {
                                                    var re = {
                                                        code : 400,
                                                        message : result.return_msg
                                                    };
                                                    res.send(re);
                                                }
                                            });
                                        });
                                        //     }
                                        // });
                                    }
                                });

                            }
                        });
                        //}
                        //}
                    });
                });

                //}





            }
        });
    })
});

router.post('/edit', function (req, res, next) {
    var detail = req.body.detail;
    var title = req.body.title;
    var desc = req.body.desc;
    var pageTitle = req.body.page_title;

    if(!title){
        var result = {
            code : 400,
            message : '操作失败',
            detail  : '标题不能为空'
        };
        res.send(result);
        return;
    }

    if(!desc){
        var result = {
            code : 400,
            message : '操作失败',
            detail  : '详情不能为空'
        };
        res.send(result);
        return ;
    }

    if(!detail){
        var result = {
            code : 400,
            message : '操作失败',
            detail  : '内容不能为空'
        };
        res.send(result);
    }else{
      // 声明类型
      var Share = AV.Object.extend('Share');
      // 新建对象
      var share = new Share();
      // 设置名称
      share.set('detail',detail);
      share.set('title',title);
      share.set('desc',desc);
      share.set('pageTitle',pageTitle);
      share.save().then(function (todo) {
        var result = {
            code : 200,
            data : todo,
            message : '保存成功'
        };
        res.send(result);
      }, function (error) {
        console.log(error);
        var result = {
            code : 400,
            error : error,
            message : '保存失败'
        };
        res.send(result);
      });
    }  
});

//定时计算数据
// 初始化并设置定时任务的时间 每天早上0：00: 10点计算
var rule = new schedule.RecurrenceRule();
rule.hour = 0;rule.minute = 0;rule.second = 10;

//处理要做的事情
 var j = schedule.scheduleJob(rule, function(){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      getLookUser(db, function(result) {
        saveToday(result.data);
        //清除今天查看人数Look
        removeLookUser();
        db.close();
      });
    });
 });

module.exports = router;
