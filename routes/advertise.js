var router = require('express').Router();
var AV = require('leanengine');
var http = require('http');

var Information = AV.Object.extend('Information');

router.post('/add', function (req, resp, next) {
	var information = new Information();
    var openid = req.body.openid;
    var name = req.body.name;
    var phoneNum = req.body.phoneNum;
    var qqNum =  req.body.qqNum;
    var education =  req.body.education;
    var birth =  req.body.birth;
    var poliOL =  req.body.poliOL;//政治面貌
    var eduInfo =  req.body.eduInfo;//教育经历
    var nowCompany =  req.body.nowCompany;
    var nowJob =  req.body.nowJob;
    var nowTime =  req.body.nowTime;
    var jobInfo =  req.body.jobInfo;//过往工作经验

    //先查询一次
    var query = new AV.Query('Information');
    query.equalTo("openid", openid);
    query.first().then(function (resume) { 
        console.log(resume); 
        if(resume){
            //存在
            var id = resume.id;
            var query = new AV.Query('Information');
            query.get(id).then(function (information) {
                information.set('openid',openid);
                information.set('name',name);
                information.set('phoneNum',phoneNum);
                information.set('qqNum',qqNum);
                information.set('education',education);
                information.set('birth',birth);
                information.set('poliOL',poliOL);
                information.set('eduInfo',eduInfo);
                information.set('nowCompany',nowCompany);
                information.set('nowJob',nowJob);
                information.set('nowTime',nowTime);
                information.set('jobInfo',jobInfo);

                information.save().then(function(resume) {
                    var result = {
                        code : 200,
                        data : resume,
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
            })
        }else{
            //不存在
            information.set('openid',openid);
            information.set('name',name);
            information.set('phoneNum',phoneNum);
            information.set('qqNum',qqNum);
            information.set('education',education);
            information.set('birth',birth);
            information.set('poliOL',poliOL);
            information.set('eduInfo',eduInfo);
            information.set('nowCompany',nowCompany);
            information.set('nowJob',nowJob);
            information.set('nowTime',nowTime);
            information.set('jobInfo',jobInfo);

            information.save().then(function(resume) {
                var result = {
                    code : 200,
                    data : resume,
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
        }
    }, function(error) {
        var result = {
            code : 100,
            message : 'error'
        }
        resp.send(result);
    })
});


router.get('/get', function(req, resp, next) {
    var openid = req.query.openid;
    var query = new AV.Query('Information');
    query.equalTo("openid", openid);

    query.first().then(function (resume) {
        var result = {
            code : 200,
            data : resume,
            message : 'operation succeeded'
        }
        resp.send(result);
    }, function(error) {
        var result = {
            code : 100,
            message : 'error'
        }
        resp.send(result);
    })
});

router.get('/list', function(req, resp, next) {

    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 20,
        search = req.query.search,
        name = req.query.sort,
        order = req.query.order || 'asc',
        i,
        max = offset + limit,
        rows = [],
        result = {
            total: +req.query.total || 800,
            rows: []
        };

    var query = new AV.Query('Information');
    query.limit(limit);
    query.skip(offset);
    if(search){
        console.log(search);
        query.contains('phoneNum',search);
    }
    

    if(order == "asc"){
        query.ascending(name);
    }else{
        query.descending(name);
    }

    query.find().then(function (resume) {
        // console.log(resume);
        // resume.attributes.jobInfo = 
        for(var i = 0; i < resume.length;i++){
            // console.log(resume[i].id);
            resume[i].set("listId", i);

            if(resume[i].attributes.jobInfo){
                var jobInfo = JSON.parse(resume[i].attributes.jobInfo);
                for(var j = 0 ; j < 5; j++){
                    // console.log(jobInfo);
                    if(!jobInfo[j]){
                        break;
                    }
                    resume[i].set("job"+j, jobInfo[j].job);
                    resume[i].set("time"+j, jobInfo[j].time);
                    resume[i].set("exp"+j, jobInfo[j].exp); 
                    resume[i].set("eva"+j, jobInfo[j].eva);
                }
            }

            if(resume[i].attributes.eduInfo){
                var eduInfo = JSON.parse(resume[i].attributes.eduInfo);
                for(var j = 0 ; j < 3; j++){
                    if(!eduInfo[j]){
                        break;
                    }
                    resume[i].set("edu"+j, eduInfo[j].edu);
                    resume[i].set("end"+j, eduInfo[j].end);
                    resume[i].set("major"+j, eduInfo[j].major); 
                    resume[i].set("schoolName"+j, eduInfo[j].schoolName);
                }
            }
            
        }
        var result = {
            code : 200,
            rows : resume,
            message : 'operation succeeded'
        }
        resp.send(result);
    }, function(error) {
        var result = {
            code : 100,
            message : 'error'
        }
        resp.send(result);
    })
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