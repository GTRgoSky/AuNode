var express = require('express');
var router = express.Router();
var taskModel = dbHelper.getModel('Task');
var taskCounter = dbHelper.getModel('Counter');
var Bug = dbHelper.getModel('Bug');

// post edit
router.get('/', function (req, res, next) {
    if (req.session.UserId) {
        res.setHeader('content-type', 'text/html; charset=utf-8');
        Bug.find({}, function (err, resd) {
            var arr = [];
            if (resd.length > 0) {
                resd.forEach(function (i, v) {
                    var obj = {
                        "BugName": i.BugName,
                        "Bugid": i.Bugid,
                        "BugType": i.BugType,
                        "BugFinish": i.BugFinish,
                        "BugUse": i.BugUse,
                        "BugCreat": i.BugCreat
                    }
                    arr.push(obj)
                })
            }
            res.render('detail/index', {
                "UserName": req.session.UserName,
                "bugList": JSON.stringify(arr)
            })
        })
    } else {
        res.render('user/login', {
            "UserName": '请登录',
            "errorMessage": false
        });
    }
});

router.get('/info', function (req, res, next) {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    if (req.session.UserId) {
        if (req.query.id) {
            Bug.find({
                Bugid: req.query.id
            }, function (err, resd) {
                var obj = {
                    "BugName": resd[0].BugName,
                    "BugType": resd[0].BugType,
                    "BugFinish": resd[0].BugFinish,
                    "BugUse": resd[0].BugUse,
                    "BugCreat": resd[0].BugCreat,
                    "BugCont": resd[0].BugCont,
                    "Bugid": resd[0].Bugid,
                }
                res.render('detail/list', {
                    "UserName": req.session.UserName,
                    "bugList": JSON.stringify(obj),
                })
            })
        } else {
            res.render('detail/list', {
                "UserName": req.session.UserName,
                "bugList": JSON.stringify({BugCreat : req.session.UserName}),
            })
        }
    } else {
        res.render('user/login', {
            "UserName": '请登录',
            "errorMessage": false
        });
    }
});

router.post('/creat', function (req, res, next) {
    res.setHeader('content-type', 'text/html; charset=utf-8');
    console.log(req.body)
    if (req.body.Bugid) {
        Bug.findOneAndUpdate({
            Bugid: req.body.Bugid
        }, {
            $set: {
                "BugName": req.body.BugName,
                "BugUse": req.body.BugUse,
                "BugType": req.body.BugType,
                "BugFinish": req.body.BugFinish,
                "BugCont": req.body.BugCont
            }
        }).exec(function (err, re) {
            //re这个是拿到更新过后的数据
            if (err) {
                res.send(err)
            } else {
                res.send("更新成功！")
            }

        })
    } else {
        var addBug = new Promise(function (resolve, reject) {
            taskCounter.findByIdAndUpdate({
                _id: 'BugId'
            }, {
                $inc: {
                    seq: 1
                }
            }, function (err, res) {
                resolve(res);
            })
        })
        addBug.then(function (re) {
            // 设置任务ID
            req.body.BugIsValid = 1;
            req.body.Bugid=re.seq;
            req.body.BugCreat = req.session.UserName;
            return Bug.create(req.body);
        }).then(function (re) {
            res.send("新增成功！")
            res.end();
        }).catch(function (err) {
            res.write(err);
            res.end();
        });

    }

});

module.exports = router;