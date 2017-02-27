var taskMap = commonInfo.map;
var $ = require('../');

module.exports = {

    getBaseData: function(re){
        var arr_time = ['TMCreateTime', 'TMEditTime', 'TMDelTime'];

        $.each(arr_time, function(i, v){
            re[v + 'Str'] = $.initGetTime(re[v], 'YYYY-MM-DD HH:mm');
        });

        re['TMRankStr'] = taskMap['Rank'][re['TMRank']];
        re['TMTeamStr'] = '';

        var arr_team = re['TMTeam'];

        $.each(arr_team, function(i, v){
            re['TMTeamStr'] += taskMap['teamEntity'][v] + (i + 1 < arr_team.length ? ', ' : '');
        });
        return re;
        
    },

    getMainData: function(re){// 获取主数据
        var self = this;
        $.each(re, function(i, v){
            re[i] = self.getBaseData(v);
        });

        return re;    
    },
    
    


}