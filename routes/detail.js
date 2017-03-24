var express = require('express');
var router = express.Router();
var taskModel = dbHelper.getModel('Task');
var taskCounter = dbHelper.getModel('Counter');

// post edit
router.get('/', function(req, res, next) {

    if(req.session.UserId){
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.render('detail/index',{"UserName":req.session.UserName})
    }else{
        res.render('user/login', {"UserName":'请登录',"errorMessage":false});
    }
});

module.exports = router;