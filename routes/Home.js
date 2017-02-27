var express = require('express');
var router = express.Router();
var taskModel = dbHelper.getModel('Task');
var taskCounter = dbHelper.getModel('Counter');
var formatTask = require('../common/format_data/task');
var $ = require('../common');

router.get('/Home',function(req, res, next){

    if(req.session.UserId){
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.render('Home/Home',{"Home":"Hello","UserName":req.session.UserName},function(err, str){
            if(err) console.log(err.msg);
            res.write(str);
            res.end();
        })
    }else{
        res.render('user/login', {"UserName":'请登录',"errorMessage":false},function(err, str){
            if(err) console.log(err.msg);
            res.write(str);
            res.end();
        });
    }
    
});

router.post('/MyTask',function(req, res, next){
    var _data = req.body;
    var _obj = {
        pageIndex: _data.pageIndex - 0,
        pageSize: _data.pageSize - 0,
        TMIsValid: _data.TMIsValid,
        orderField: _data.orderField,
        orderIndex: _data.orderIndex,
    };

taskModel.count({TMUserId : req.session.UserId})// 优先选用
        .then(function(re){// 列表集合
            // _obj.counts = re.length;
            _obj.counts = re;

            return  taskModel.find({ $or: [{ TMUserId: req.session.UserId },{ TMDoUser: req.session.UserName}]})
                .limit(_obj.pageSize)
                .skip((_obj.pageIndex - 1) * _obj.pageSize)
                .exec();
        }).then(function(re){// 查询筛选集合
            _obj.items = re;
            var taskMap = commonInfo.map
            var arr_team = re;
            _obj.IsUser=req.session.UserId;
            if(arr_team.length == 0){
                res.send(_obj);
            }
            var k = 1;
            $.each(arr_team, function(i, v){
                _obj.items[i]._doc.TMTeamStr=''
                $.each(v._doc.TMTeam, function(_i, _v){
                    _obj.items[i]._doc.TMTeamStr += taskMap['teamEntity'][_v] + (_i + 1 < v._doc.TMTeam.length ? ', ' : '');
                    if(i+1==arr_team.length){
                        if(k==1){
                            res.send(_obj);
                        }
                        k++;
                    }
                })
                
            });
            
            
            
        }).catch(function(err){
            res.write(err);
            res.end();
        });
        
});

module.exports = router;