var router = require('express').Router();
var AV = require('leanengine');
var http = require('http');

var Users = AV.Object.extend('Users');

router.get('/userInfos', function (req, resp, next) {
	var users = new Users();
	var userName = req.body.userName;
    var phoneNum = req.body.phoneNum;
    var qqNum =  req.body.qqNum;
    var education =  req.body.education;
    var bithNum =  req.body.bithNum;
    var politicalSta =  req.body.politicalSta;//政治面貌
    var educationExp =  req.body.educationExp;//教育经历
    var company =  req.body.company;
    var work =  req.body.work;
    var workTime =  req.body.workTime;
    var workExp =  req.body.workExp;//工作经验
    var projectExp =  req.body.projectExp;//教育经验
    var evaluation =  req.body.evaluation;//自我评价
    users.set('userName',userName);
    users.set('phoneNum',phoneNum);
    users.set('qqNum',qqNum);
    users.set('education',education);
    users.set('bithNum',bithNum);
    users.set('politicalSta',politicalSta);
    users.set('educationExp',educationExp);
    users.set('company',company);
    users.set('work',work);
    users.set('workTime',workTime);
    users.set('workExp',workExp);
    users.set('projectExp',projectExp);
    users.set('evaluation',evaluation);
    users.save().then(function(users) {
        var result = {
            code : 200,
            user : users,
            message : 'operation succeeded'
        }
        resp.send(result);
    }, function(error) {
        var result = {
            code : 100,
            message : 'error'
        }
        resp.send(result);
    });
});


router.get('/find', function(req, resp, next) {
	var users = new Users();
    var userName = req.body.userName;
    console.log(userName);
    var cql = 'select * from Users where userName = '+ userName;
  	AV.Query.doCloudQuery(cql).then(function (data) {
      // results 即为查询结果，它是一个 AV.Object 数组
      var results = data.results;
      var result = {
            code : 200,
            data : results,
            message : "success"
        }
        resp.send(result);
  	}, function (error) {
  		 var result = {
            code : 400,
            message : "error"
        }
        resp.send(result);
  	});
});

router.get('/update', function(req, resp, next) {
	var users = new Users();
	var userName = req.body.userName;
	var info = req.body.info;
	var value = req.body.value; 
	var cql = 'update Users set '+ info +'= '+ value + 'where userName='+ userName;
	AV.Query.doCloudQuery(cql)
  	.then(function (data) {
    	var result = {
            code : 200,
            data : data,
            message : 'operation succeeded'
        }
        resp.send(result);
  	}, function (error) {
    var result = {
            code : 100,
            message : 'error'
        }
        resp.send(result);
  });
});

router.get('/delete', function(req, resp, next) {
	var users = new Users();
	var userName = req.body.userName;
	var cql = 'delete from Users where userName='+ userName;
	AV.Query.doCloudQuery(cql).then(function () {
		var result = {
            code : 200,
            message : 'operation succeeded'
        }
        resp.send(result);
  }, function (error) {
  	var result = {
            code : 100,
            message : 'error'
        }
        resp.send(result);
  });
	//http://localhost:3000/advertise/userInfos?userName=1&phoneNum=1&qqNum=1&education=1&bithNum=1&politicalSta=1&educationExp=1&company=1&work=1&workTime=1&workExp=1&projectExp=1&evaluation=1
});



module.exports = router;