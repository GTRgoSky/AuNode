var moment = require('moment');

module.exports = {
    // 遍历
    each: function(aim, cb){

        if(!aim) return;

        if(aim.constructor == Object){
            for(i in aim){
                cb(i, aim[i]);
            }
        }else if(aim.constructor == Array){
            for(var i = 0; i < aim.length; i++){
                cb(i, aim[i]);
            }
        }
    },

    /**
    * [用monent格式化时间]
    * http://momentjs.cn
    * @param {string}   datetime [可以是"/Date(1473146416663)/"或者是时间格式字符串]
    * @param {string}   type [""YYYY-MM-DD"或者"YYYY-MM-DD HH:mm",详细参考moment api]
    * @param {num}      redatetime    获取得到时间戳（通过正则表达式匹配）
    */
    initGetTime:function(datetime, type){

        if(!datetime) return '';

        var redatetime = isNaN(new Date(datetime).getTime()) ? parseInt(datetime.match(/\d|-/g,'').join('')) : datetime;
        return moment(redatetime).format(type);
    },

    // 数据库查询的一些操作（先写在这里）
    formatSearchParam: {
        time: function(_data, param){// 对于时间的操作（这种查询肯定是区间之内的查询）
            var _start = _data[param + 'Start'];
            var _end = _data[param + 'End'];
            var _arr = [{},{}];

            _arr[0][param] = _start ? {$gte: new Date(_start)} : {$exists: true};
            _arr[1][param] = _end ? {$lte: new Date(_end).setDate(new Date(_end).getDate() + 1)} : {$exists: true};

            return _arr;// 返回数组（concat方法） 
        },
        isNull: function(){

        },
    },

    // 二进制运算反解
    analysisValue: function(num){
        var list = [];
        var max = 0;
        var temp = 0;
        while (true){
            temp = Math.pow(2, max);
            if ((num & temp) == temp) list.push(max);
            if (temp > num || max > 100) break;//max>100  避免死循环
            max++;
        }
        return list;
    },

    // Excel时间转换
    excelFormatDate: function(date){
        if(!date || date == 1) return '';
        return new Date(Math.ceil((date - 70 * 365 - 19) * 86400 - 8 * 3600) * 1000);
    }
};