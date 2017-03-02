var express = require('express');
var router = express.Router();
var taskModel = dbHelper.getModel('User');
var taskCounter = dbHelper.getModel('Counter');
var $ = require('../common');


router.get('/', function(req, res, next) {
    res.redirect('/LoginPage');
});

router.get('/LoginPage',function(req, res, next){
    if(req.session.UserId){
        res.redirect('/Home/Home?UserName='+req.session.UserName)
    }else{
        res.render('user/login', {"UserName":'请登录',"errorMessage":false},function(err, str){
            if(err) console.log(err.msg);
            res.write(str);
            res.end();
        });
    }
    
});

//登录过程
router.post('/login',function(req, res, next){

    var UserName = req.body.UserName;//获取用户名
    var UserPassWord = req.body.UserPassWord;//用户密码
    taskModel.findOne({UserName: UserName,UserPassWord:UserPassWord}, function(err, re){
        if(re){
            console.log(re);
            if(err) {
                res.write(err);
                return res.end();
            }
            req.session.UserId=re.UserId;
            req.session.UserName=decodeURIComponent(re.UserName);
            res.redirect('/Home/Home');//登录成功后返回到Task页面附带用户Name
        }else{
            res.render('user/login', {"UserName":'请登录',"errorMessage":true},function(err, str){
                if(err) console.log(err.msg);
                res.write(str);
                res.end();
            });
        }
       
    });
    
})

//注册页面
router.get('/registPage',function(req, res, next){
    res.render('user/regist',{"UserName":'请登录'}, function(err, str){
            if(err) console.log(err.msg);
            res.write(str);
            res.end();
        });
});

//注册过程
router.post('/regist',function(req, res, next){
    taskCounter.findByIdAndUpdate({_id: 'UserId'}, {$inc: {seq: 1}}).then(function(re){
                // 设置任务ID
                req.body.UserId = re.seq;
                req.body.UserRoot = 0 ;
                return taskModel.create(req.body);
            }).then(function(re){
                req.session.UserId=re.UserId;
                res.redirect('/Task/List?UserName='+re.UserName);
                res.end();
            }).catch(function(err){
                res.write(err);
                res.end();
            });
})

// 更新数据
router.get('/UpDateAUData', function(req, res, next) {

    
    
    $.each()

    // fs.readFile('./AUData.xlsx', {flag: 'r+', encoding: 'utf8'}, function (err, data) {
    //     if(err) {
    //         console.error(err);
    //         return;
    //     }
    //     console.log(data);
    // });


});

//退出
router.get('/exit',function(req, res, next){
    req.session.UserId=undefined;
    res.redirect('/');
})

module.exports = router;