var path = require('path');
var xlsx = require('node-xlsx');
var xlsx = require('node-xlsx');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
// mongoose.connect('mongodb://10.101.48.49:27017/AU_T');
mongoose.connect('mongodb://location:27017/TestExport');

var $ = require('../common');
var format = require('./format');

var arr_key = [
    {
        sheetName: 'TourismMission',
        idKey: 'TMId'
    },
    {
        sheetName: 'TourismMissionLog',
        idKey: 'TMLId'
    },
    {
        sheetName: 'TourismSubMission',
        idKey: 'TSMId'
    },
    {
        sheetName: 'TourismSubMissionLog',
        idKey: 'TSMLId'
    },
    {
        sheetName: 'TourismMissionCase',
        idKey: 'TMCId'
    },
    {
        sheetName: 'TourismMissionCaseLog',
        idKey: 'TMCLId'
    },
    {
        sheetName: 'TourismBugManage',
        idKey: 'TBMId'
    },
    {
        sheetName: 'TourismBugManageLog',
        idKey: 'TBMLId'
    },
    {
        sheetName: 'TourismPublishManage',
        idKey: 'TPMId'
    },
    {
        sheetName: 'TourismOnlineBug',
        idKey: 'TOBId'
    },
    {
        sheetName: 'TourismTroubleManage',
        idKey: 'TTMId'
    },
    {
        sheetName: 'TourismDemand',
        idKey: 'TDId'
    }
];

var counts = 0; // 导入计数器

var countModel = mongoose.model('Counter', new Schema(require('./schema/counter')), 'Counter');

countModel.remove({}, function(){
    console.log('总计' + arr_key.length + '张表');
    setData(arr_key[counts].sheetName);
});

function setData(v){
    var model = mongoose.model(v, new Schema(require('./schema/' + v)), v);

    // 清空元数据
    console.log('--------------------开始第 ' + (counts + 1) + ' 张表--------------------');
    console.log('正在清除 ' + v + '表数据！！！');
    model.remove({})
    .then(function(){
        console.log('清除' + v + '表数据成功，开始读取数据。。。');
        return xlsx.parse(__dirname + '/data/' + v + '.xlsx')[0];
    })
    .then(function(re){
        console.log(v + '表数据读取成功，开始导入。。。');

        var idCounts = 0;
        var idKey = arr_key[counts].idKey;

        $.each(re.data, function(_i, _v){
            if(_i == 0 || !_v[1]) return;

            var _obj = format[v](_v);

            if(_obj[idKey] > idCounts) idCounts = _obj[idKey];

            model.create(_obj, function(err, _re){
                if(err){// 表数据验证失败，直接跳过
                    var _str = '';
                    $.each(err.errors, function(__i, __v){
                        _str += err.message + __v.message;
                    });
                    return console.log(_str);
                }
                if((_i + 1) == re.data.length){// 当前表是否全部导出

                    // console.log(idKey + '最大为：' + idCounts);

                    countModel.create({
                        _id: idKey,
                        seq: (idCounts - 0 + 1)
                    }, function(err, __re){
                        console.log('--------------------' + v + '表导入成功！--------------------');
                        if((counts + 1) == arr_key.length) {// 所有表是否全部导出
                            console.log('--------------------已经全部导入成功！--------------------');
                        }else{
                            counts++;
                            setData(arr_key[counts].sheetName);
                        }
                    });
                }
            });
        });
    });
}