var router = require('express').Router();
var AV = require('leanengine');
var http = require('http');

var Information = AV.Object.extend('Information');

router.get('/userInfos', function (req, resp, next) {
	var information = new Information();
	var userName = req.query.userName;
    var phoneNum = req.query.phoneNum;
    var qqNum =  req.query.qqNum;
    var education =  req.query.education;
    var bithNum =  req.query.bithNum;
    var politicalSta =  req.query.politicalSta;//政治面貌
    var educationExp =  req.query.educationExp;//教育经历
    var company =  req.query.company;
    var work =  req.query.work;
    var workTime =  req.query.workTime;
    var workExp =  req.query.workExp;//工作经验
    var projectExp =  req.query.projectExp;//教育经验
    var evaluation =  req.query.evaluation;//自我评价
    information.set('userName',userName);
    information.set('phoneNum',phoneNum);
    information.set('qqNum',qqNum);
    information.set('education',education);
    information.set('bithNum',bithNum);
    information.set('politicalSta',politicalSta);
    information.set('educationExp',educationExp);
    information.set('company',company);
    information.set('work',work);
    information.set('workTime',workTime);
    information.set('workExp',workExp);
    information.set('projectExp',projectExp);
    information.set('evaluation',evaluation);
    information.save().then(function(users) {
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
	var information = new Information();
    var userName = req.query.userName;
    console.log(userName);
    // var cql = 'select * from Information where objectId = "588ddce78fd9c5d6780ffab0"';
    var cql = 'select * from Information where userName = "'+userName+'"';
    console.log(cql);
  	AV.Query.doCloudQuery(cql).then(function (data) {
  		console.log(data);
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
	var info = req.query.info;
	var value = req.query.value; 
	var id = req.query.id;
    var information = AV.Object.createWithoutData('Information', id);
  		// 修改属性
  	information.set(info, value);
  		// 保存到云端
  	information.save();
      	var result = {
            code : 200,
            message : "success"
        }
       	resp.send(result);
  	
	// var cql = 'update Information set '+info+'="'+value+'" where userName="'+userName+'"';
	// AV.Query.doCloudQuery(cql)
 //  	.then(function (data) {
 //    	var result = {
 //            code : 200,
 //            data : data,
 //            message : 'operation succeeded'
 //        }
 //        resp.send(result);
 //  	}, function (error) {
 //    var result = {
 //            code : 100,
 //            message : 'error'
 //        }
 //        resp.send(result);
 //  });
});

router.get('/delete', function(req, resp, next) {
	// var information = new Information();
	var id = req.query.id;
    var information = AV.Object.createWithoutData('Information', id);
 	information.destroy().then(function (success) {
    	// 删除成功
    	var result = {
            code : 200,
            message : 'operation succeeded'
        }
        resp.send(result);
 	 }, function (error) {
    // 删除失败
    	var result = {
            code : 100,
            message : 'error'
        }
        resp.send(result);
  	});
  });
	// var cql = 'delete from Information where userName="'+userName+'"';
	// console.log(cql);
	// AV.Query.doCloudQuery(cql)
	// .then(function () {
	// 	var result = {
 //            code : 200,
 //            message : 'operation succeeded'
 //        }
 //        resp.send(result);
 //  }, function (error) {
 //  	var result = {
 //            code : 100,
 //            message : 'error'
 //        }
 //        resp.send(result);
 //  });
	//http://localhost:3000/advertise/userInfos?userName=1&phoneNum=1&qqNum=1&education=1&bithNum=1&politicalSta=1&educationExp=1&company=1&work=1&workTime=1&workExp=1&projectExp=1&evaluation=1



module.exports = router;