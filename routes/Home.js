var express = require('express');
var router = express.Router();
var taskModel = dbHelper.getModel('Task');
var taskCounter = dbHelper.getModel('Counter');
var formatTask = require('../common/format_data/task');
var detailModel = dbHelper.getModel('Detail');
var BugPage = dbHelper.getModel('Bug');
var $ = require('../common');

router.get('/home',function(req, res, next){
    if(req.session.UserId){
        res.setHeader('content-type', 'text/html; charset=utf-8');
        res.render('home/home',{"home":"Hello","UserName":req.session.UserName},function(err, str){
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

//查看PM关联任务
router.post('/MyTask',function(req, res, next){
    var _data = req.body;
    var _obj = {
        pageIndex: _data.pageIndex - 0,
        pageSize: _data.pageSize - 0,
        TMIsValid: _data.TMIsValid,
        orderField: _data.orderField,
        orderIndex: _data.orderIndex,
    };
    var tabObj ={};
    taskModel.count({TMUserId : req.session.UserId})// 优先选用
            .then(function(re){// 列表集合
                // _obj.counts = re.length;
                _obj.counts = re;
                var tmp  ={
                    $or: [{ TMUserId: req.session.UserId },{ TMDoUser: req.session.UserName}],
                    TMIsValid:{$ne:"2"}
                }
                return  taskModel.find(tmp)
                    .limit(_obj.pageSize)
                    .skip((_obj.pageIndex - 1) * _obj.pageSize)
                    .sort({"TMRank":1})
                    .exec();
            }).then(function(re){// 查询筛选集合
                _obj.items = re;
                var taskMap = commonInfo.map
                var arr_team = re;
                _obj.IsUser=req.session.UserId;
                BugPage.find({BugUse:req.session.UserName},function(err,tab3){
                            tabObj.tab3=[];
                            tabObj.tab2=[];
                            tabObj.tab3 = tab3;
                            detailModel.find({UserName:req.session.UserName},function(err,tab2){
                                console.log(tab2);
                                if(tab2.length==0){
                                    if(arr_team.length == 0){
                                        tabObj.tab1=_obj
                                        res.send(tabObj);
                                    }else{
                                        var k = 1;
                                        $.each(arr_team, function(i, v){
                                            if(v.TMIsValid == 2) return;
                                            _obj.items[i]._doc.TMTeamStr=''
                                            $.each(v._doc.TMTeam, function(_i, _v){
                                                _obj.items[i]._doc.TMTeamStr += taskMap['teamEntity'][_v] + (_i + 1 < v._doc.TMTeam.length ? ', ' : '');
                                                if(i+1==arr_team.length){
                                                    if(k==1){
                                                        k++;
                                                        //返回数据容器 tab1,2,3分别为对应tab数据
                                                        tabObj.tab1=_obj;
                                                        res.send(tabObj);                           
                                                    }
                                                }
                                            })
                                        });
                                    } 
                                }
                                $.each(tab2,function(_ii,_v){
                                    taskModel.find({TMId:_v._doc.TMId},function(err,tab2val2){
                                        console.log(tab2val2)
                                        tabObj.tab2.push(tab2val2[0]);
                                        if(arr_team.length == 0 && _ii+1 == tab2.length){
                                            tabObj.tab1=_obj
                                            res.send(tabObj);
                                        }else{
                                            var k = 1;
                                            $.each(arr_team, function(i, v){
                                                if(v.TMIsValid == 2) return;
                                                _obj.items[i]._doc.TMTeamStr=''
                                                $.each(v._doc.TMTeam, function(_i, _v){
                                                    _obj.items[i]._doc.TMTeamStr += taskMap['teamEntity'][_v] + (_i + 1 < v._doc.TMTeam.length ? ', ' : '');
                                                    if(i+1==arr_team.length && _ii+1 == tab2.length){
                                                        if(k==1){
                                                            k++;
                                                            //返回数据容器 tab1,2,3分别为对应tab数据
                                                            tabObj.tab1=_obj;
                                                            res.send(tabObj);                           
                                                        }
                                                        
                                                    }
                                                })
                                            });
                                        }     
                                    })
                                })
                                                                    
                        })
                })
        }).catch(function(err){
            res.write(err);
            res.end();
        });
        
});



//人力视图
router.get('/FlowChart', function(req, res, next) {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    
    res.render('home/flow-chart', {type: req.query.type || 0,UserName: ''}, function(err, data){
        if (err)  return res.req.next(err);

        res.write(data);
        res.end();
    });
});

//组内对比
router.get('/TeamChart', function(req, res, next) {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    
    res.render('team/team', {type: req.query.type || 0,UserName: ''}, function(err, data){
        if (err)  return res.req.next(err);

        res.write(data);
        res.end();
    });
});

/* 关于极光--版本推进 */
router.get('/Echart', function(req, res, next) {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    if(!req.session.UserId){
        res.redirect('/LoginPage');
    }
    res.render('home/Echart', {UserName: req.session.UserName}, function(err, data){
        if (err)  return res.req.next(err);

        res.write(data);
        res.end();
    });
});

/* 关于极光--版本推进 */
router.get('/History', function(req, res, next) {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    
    res.render('home/history', {UserName: ''}, function(err, data){
        if (err)  return res.req.next(err);

        res.write(data);
        res.end();
    });
});

module.exports = router;