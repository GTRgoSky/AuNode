var express = require('express');
var router = express.Router();
var taskModel = dbHelper.getModel('Task');
var ejsExcel = require("ejsExcel");
var fs = require("fs");
var path = require('path')

//获得Excel模板的buffer对象
// 

//数据源



router.get('/excel', function (req, res) {
    //用数据源(对象)data渲染Excel模板
    var a = path.join(__dirname, "../public/excel/")
    //a获取的是全局路径
    var exlBuf = fs.readFileSync(a + "excel.xlsx");
    taskModel.find({}, function (err, re) {
        re.forEach(item => {
            var creat = new Date(item.TMCreateTime);
            item._doc.TMCreateTime = creat.getFullYear() + '-' + (creat.getMonth() + 1) + '-' + creat.getDate();
        })
        var result = [];
        result.push(re)
        ejsExcel.renderExcelCb(exlBuf, result, function (err, exlBuf2) {
            if (err) {
                console.error(err);
                return;
            }
            //exlBuf2文件的二进制流
            // var sendUrl = a + "task_"+Math.random()+".xlsx";
            // fs.writeFileSync(sendUrl, exlBuf2);//写文件到服务端
            res.setHeader('Content-Type', 'applicationnd.openxmlformats; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent('任务统计') + '.xlsx');
            res.end(exlBuf2, 'binary');
        });
    })

})



module.exports = router;