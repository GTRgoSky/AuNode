
(function () {

    var home = {
        
        ready: function(){
            var self = this;
        },
        methods: {
            buildEC: function (_re, _type) {
                var self = this;
                var _option;

                var pmStr = commonInfo.PM ? '创建' : '';

                if (_type == 'line') {
                    var arr_name = [];
                    var arr_count = [];
                    $.each(_re, function (i, v) {
                        arr_name.push(v.Name);
                        arr_count.push(v.Count);
                    });
                    _option = {
                        title: {
                            text: '当月组员' + pmStr + '任务折线图',
                            padding: [10,0,0,50],
                        },
                        tooltip: {
                            trigger: 'axis',
                        },
                        legend: {
                            data:['当月组员' + pmStr + '任务折线图'],
                            left: 'left',
                            padding: [18,0,0,260],
                            selectedMode: false
                        },
                        grid: {
                            left: '3%',
                            right: '5%',
                            bottom: '8%',
                            top: '18%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            name: '成员',
                            boundaryGap: [1, 0],
                            data: arr_name,
                            axisLabel: {
                                interval: 0,
                                rotate: 25
                            }
                        },
                        yAxis: {
                            type: 'value',
                            boundaryGap: ['0', '20%'],
                            min: 'dataMin'
                        },
                        series: [
                            {
                                name:'组员当月' + pmStr + '任务',
                                type: 'line',
                                data: arr_count,
                                markPoint: {
                                    data: [
                                        { type: 'max', name: '最大值' },
                                    ]
                                },
                                markLine: {
                                    data: [
                                        { type: 'average', name: '平均值' }
                                    ]
                                }
                            }
                        ]
                    };
                } else if (_type == 'bar') {

                    var obj_arr = {};

                    $.each(_re, function (i, v) {
                        $.each(_re[i], function (_i, _v) {
                            if (typeof (obj_arr[_i]) == 'object') {
                                obj_arr[_i].push(_v);
                            } else {
                                obj_arr[_i] = [_v];
                            }
                        });
                    });

                    obj_arr['data'] = commonInfo.QA ? ['缺陷数', '用例数', '任务数'] : ['进行中', '未开始', '已结案'];
                    obj_arr['series'] = commonInfo.QA ? [] : [{
                        name: pmStr + '任务总数',
                        type: 'bar',
                        data: obj_arr.counts,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                            }
                        }
                    }];

                    $.each(obj_arr.data, function(i, v){

                        var _obj = {
                            name: obj_arr.data[i],
                            type: 'bar',
                            data: obj_arr['flag' + (i + 1)],
                        };

                        if(!commonInfo.QA){
                            _obj.stack = pmStr + '任务总数';
                        }

                        obj_arr['series'].push(_obj);
                    });

                    _option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        legend: {
                            data: obj_arr.data
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [{
                            type: 'category',
                            data: ['本月数据', '同比上月']
                        }],
                        yAxis: [{
                            type: 'value'
                        }],
                        series: obj_arr.series
                    };
                }

                var EChart = echarts.init($('.J-ECwell')[0], 'roma');//canvas不支持JQ对象
                EChart.setOption(_option, true);
                $(window).resize(function () {
                    self.$set('monthTaskCounts', $(this).width() < 850 ? 0 : 1);
                    EChart.resize();
                });
            },
            //编辑
            edit: function ($index) {
                var self = this;
                if (self.listdata.editIndex != -1) {
                    toastr.warning("请先保存数据！");
                    return;
                }
                self.$set('listdata.cachedata', JSON.parse(JSON.stringify(self.listdata.items[$index])));
                self.$set('listdata.editIndex', $index);
            },
            //撤销编辑
            cancel: function ($index) {
                var self = this;
                self.$set('listdata.items[' + $index + ']', JSON.parse(JSON.stringify(self.listdata.cachedata)));
                self.$set('listdata.cachedata', null);
                self.$set('listdata.editIndex', -1);
                return;
            },
            //保存已分配任务
            save: function($index, pace){
                var self = this;
                var _data = JSON.parse(JSON.stringify(self.listdata.items[$index]));

                if (_data.TSMPace > 100 || _data.TSMPace < 0) {
                    toastr.error('任务进度不能超过100且不可小于0！');
                    return;
                }

                if (pace == 1) _data.TSMPace = 100;

                $.ajax({
                    url: '/Home/SaveSubList',
                    data: _data,
                    type: 'POST',
                    success: function (re) {
                        commonMethods.toastr.request(re, function(){
                            _data.TSMFlag = re.item.TSMFlag;
                            self.$set('listdata.items[' + $index + ']', _data);
                            self.$set('listdata.editIndex', -1);
                        });
                    }
                });
            },

            // 排序搜索
            getOrderData: function(tabId, param){// tabId: 1、vuelist排序 2、其他列表排序（默认1）
                var self = this;
                var $form = $('#tab-' +　tabId).find('form');
                var $orderType = $form.find('[name="orderType"]');

                $form.find('[name="orderItem"]').val(param);
                $orderType.val($orderType.val() == 0 ? 1 : 0);

                if(tabId == 1){
                    self.getData(1, 'unwanted');
                }else{
                    self.getOtherPage(tabId);
                }
            },

            // 获取其他tab内列表
            getOtherPage: function(tabId){// tabId：2、未分配任务 3、缺陷 4、线上BUG
                var self = this;
                if(self.canSearch == 0) return;

                commonMethods.progressBar.showProgressBar('Success');
                var $form = $('#tab-' +　tabId).find('form');

                self.canSearch = 0;

                $.ajax({
                    url: '/Home/GetHomeOtherPage?reqType=' + tabId,
                    data: $form.serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success: function(re){
                        self.$set('otherPageList' + tabId, re);

                        commonMethods.progressBar.removeProgressBar();

                        setTimeout(function(){
                            self.canSearch = 1;
                            commonMethods.tooltip();
                        }, 500);

                        if(tabId == 2){//给未分配任务设置分页
                            self.pageInit({
                                el: $form.closest('.J-Pane').find('.J-Pagination'),
                                size: re.pagesize,
                                count: re.count,
                                index: re.pageindex,
                            }, function(page, event){
                                $form.find('[name="pageindex"]').val(page);
                                self.getOtherPage(tabId);
                            });
                        }
                    }
                });
            },

            // 其他列表页面的重置
            clearOtherPage: function(tabId){
                var self = this;
                var $form = $('#tab-' +　tabId).find('form');
                $form.find('input,select').val('').trigger('change');
                self.getOtherPage(tabId);
            },

            // BUG的筛选
            searchBug: function(role){// role：1：分配人是自己、2：经办人是自己
                var self = this;
                var $form = $('#tab-4').find('form');

                $form.find('[name=isCreator]').val(role == 1);
                $form.find('[name=isOperator]').val(role != 1);

                self.getOtherPage(4);
            },
            

        }
    };

    var list = new vueList({
        vueId: '#myTask',
        vueUrl: '/Home/MyTask',
        vuePageSize: 10,
        needlocalData: 1,
        vueMixins: [home],
        vueCallback: function (re,_self) {
            console.log(re)
        },
    });
})();