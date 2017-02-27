var express = require('express');
var router = express.Router();
var taskModel = dbHelper.getModel('Task');
var taskCounter = dbHelper.getModel('Counter');
var userModel = dbHelper.getModel('User');
var detailModel = dbHelper.getModel('Detail');
var formatTask = require('../common/format_data/task');
var $ = require('../common');

/**
 * 任务模块
 */
// get edit
router.get('/Edit', function(req, res, next) {

    res.setHeader('content-type', 'text/html; charset=utf-8');

    var _obj = {$data: {},"UserName":req.query.UserName};
    var TMId = req.query.id;

    if(TMId){
        taskModel.findOne({TMId: TMId}, function(err, re){
            if(err) {
                res.write(err);
                return res.end();
            }
            _obj.$data = re;
            console.log(_obj)
            renderPage(re);
            
        });
    }else{
        var re ={};
        re.TMUserId=req.session.UserId
        renderPage(re);
    }

    function renderPage(re){
        userModel.findOne({UserId:re.TMUserId}, function(err, reason){
            if(err) {
                res.write(err);
                return res.end();
            }
            _obj.PmName = reason.UserName;
            _obj.UserName=req.session.UserName;
            res.render('task/edit', _obj, function(err, str){
                if(err) console.log(err.msg);
                    res.write(str);
                res.end();
            });
        });
        
    }
});

// post edit
router.post('/Edit', function(req, res, next) {

    var taskId = req.body.TMId;
    

    if(taskId){// 编辑

        // 编辑时间
        req.body.TMEditTime = Date.now();

        taskModel.findOneAndUpdate({'TMId': taskId}, req.body, function(err, re){
            if(err) {
                res.write(err);
                return res.end();
            }
            res.redirect('/Task/List');
            res.end();
        });

    }else{// 新增

        var addtask = new Promise(function (resolve, reject) {
        //.then是Promise 特有方式
        //成功resolve送出，失败reject送出
            taskCounter.findByIdAndUpdate({_id: 'TMId'}, {$inc: {seq: 1}},function(err,res){
                resolve(res);//成功执行这个（抛出参数）
            })
            
        }) 

        addtask.then(function(re){
                // 设置任务ID
                req.body.TMId = re.seq;
                req.body.TMUserId=req.session.UserId;
                return taskModel.create(req.body);
            }).then(function(re){
                res.redirect('/Task/List');
                res.end();
            }).catch(function(err){
                res.write(err);
                res.end();
            });
    }
});

// 对任务有效性做设置（设置一个标志位，做假删除）
router.get('/SetValid', function(req, res, next) {

    var TMId = req.query.id;
    var _type = req.query.type - 0;

    if(TMId){
        taskModel.findOneAndUpdate({TMId: TMId}, {
            $set: {
                TMDelTime: Date.now(),
                TMIsValid: _type
            }
        }).exec(function(err, re){
            if(err) {
                res.json({
                    msg: err,
                    status: 0
                });
            }else{
                res.json({
                    msg: (_type == 1 ? '恢复' : '删除') + '成功！',
                    status: 1
                });
            }
            res.end();
        });
    }else{
        res.json({
            msg: '请输入id！',
            status: 0
        });
        res.end();
    }
});

// get list
router.get('/List', function(req, res, next) {
    if(req.session.UserId){
        res.setHeader('content-type', 'text/html; charset=utf-8');

        res.render('task/list', {"UserName":req.query.UserName},function(err, str){
            if(err) console.log(err.msg);
            res.write(str);
            res.end();
        });
    }else{
        res.redirect('/LoginPage');
    }
    
});

// post list
router.post('/List', function(req, res, next) {

    var _data = req.body;

    var _obj = {
        pageIndex: _data.pageIndex - 0,
        pageSize: _data.pageSize - 0,
        TMIsValid: _data.TMIsValid,
        orderField: _data.orderField,
        orderIndex: _data.orderIndex,
    };
    var obj_search = {
        TMId: req.body.TMId ? (isNaN(req.body.TMId) ? 0 : req.body.TMId) : {$exists: true},
        TMTitle: new RegExp(_data.TMTitle),
        TMTeam: _data.TMTeam || new RegExp(''),// 数组正则匹配多选（也可以{$exists: true}）
        TMIsValid: _obj.TMIsValid,
        TMRank: _data.TMRank || {$exists: true},
        $and: []
    };

    var arr_time = ['TMCreateTime', 'TMEditTime'];

    $.each(arr_time, function(i, v){
        obj_search.$and = obj_search.$and.concat($.formatSearchParam.time(_data, v));
    });

    // var _query = taskModel.find(obj_search);// QueryBuilder接口

    taskModel.count(obj_search)// 优先选用
        .then(function(re){// 列表集合
            // _obj.counts = re.length;
            _obj.counts = re;

            return  taskModel.find(obj_search)
                .sort(_data.orderField ? (_data.orderIndex == 1 ? '' : '-' ) + _data.orderField : '-TMId')
                .limit(_obj.pageSize)
                .skip((_obj.pageIndex - 1) * _obj.pageSize)
                .exec();
        }).then(function(re){// 查询筛选集合
            _obj.items = formatTask.getMainData(re);
            _obj.IsUser=req.session.UserId;
            res.render('task/list-table', {$data: _obj}, function(err, str){
                res.json(Object.assign(_obj, {html: str}));
                res.end();
            });
        }).catch(function(err){
            res.write(err);
            res.end();
        });
});

//经办人select2查询
//登录过程
router.get('/douser',function(req, res, next){
// name:/Joe/
    userModel.find({},function(err, re){
            if(err) {
                res.write(err);
                return res.end();
            }
            var reason={};
            reason.items=[];
            $.each(re,function(i,v){
                reason.items.push(
                    {
                        id: v.UserId,
                        text: v.UserName
                    }
                );
            })
            res.json(reason);
    });
    
})

router.get('/detail', function(req, res, next) {
//任务详情页
// detailModel
    res.setHeader('content-type', 'text/html; charset=utf-8');

    var _obj = {$data: {},"UserName":req.query.UserName,$son:{}};
    var TMId = req.query.id;

    if(TMId){
        taskModel.findOne({TMId: TMId}, function(err, re){
            if(err) {
                res.write(err);
                return res.end();
            }
            _obj.$data = re;
            
            renderPage(re);
            
        });
    }

    function renderPage(re){
        userModel.findOne({UserId:re.TMUserId}, function(err, reason){
            if(err) {
                res.write(err);
                return res.end();
            }
            _obj.PmName = reason.UserName;
            _obj.UserName=req.session.UserName;
            detailModel.find({TMId: TMId},function(err,ans){
                // $.each(ans,function(_itime,_vtime){
                //     _vtime.UseTMTime = $.initGetTime('/Date('+Date.parse(_vtime.TMTime)+')/','YYYY-MM-DD');
                // })
                _obj.$son=ans;
                res.render('task/detail', _obj, function(err, str){
                    if(err) console.log(err.msg);
                        res.write(str);
                        res.end();
                });
            })
            
        });
        
    };
});

router.post('/detail/adUser',function(req,res){
    console.log(req.body)
    req.body.TMId = req.query.Tmid;

    detailModel.create(req.body,function(err,re){
        res.send(re)
    }); 
})

router.get('/detail/del',function(req,res){
    
    detailModel.findOneAndUpdate({'TMTitle': req.query.title},{
            $set: {
                TMTitle: '',
            }
        }).exec(function(err, re){
            if(err) {
                res.json({
                    msg: err,
                    status: 0
                });
            }else{
                res.redirect('/Task/detail?id='+req.query.id+'');
            }
            res.end();
        });
})



module.exports = router;