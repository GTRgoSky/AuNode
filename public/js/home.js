(function () {

    var home = {

        ready: function () {
            var self = this;
        },
        methods: {
            buildEC: function (obj, unit) {
                var self = this;
                unit="个";
                // 基于准备好的dom，初始化echarts图表  unit单位
                var myChart = echarts.init(document.getElementById('main'));
                var option = {
                    textStyle: {
                        color: 'black'
                    },
                    title: {
                        text: '',
                        // right: '10%',
                        // top: '-20px',
                        subtext: '单位（' + unit + '）'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['执行任务数']
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: ["05月01日","05月02日","05月05日","05月04日","05月05日","05月06日","05月07日","05月08日",,"05月10日","05月11日","05月12日","05月13日","05月14日","05月15日","05月16日","05月17日",
"05月18日","05月19日","05月20日","05月21日","05月22日","05月23日","05月24日","05月25日","05月26日","05月27日","05月28日","05月29日","05月30日","05月31日"],
                    }],
                    yAxis: [{
                        type: 'value',
                        scale: true,
                    }],
                    series: [{
                            name: "执行任务数",
                            type: 'line',
                            data: obj,
                            markPoint: {
                                data: [{
                                        type: 'max',
                                        name: '最大值'
                                    },
                                    {
                                        type: 'min',
                                        name: '最小值'
                                    }
                                ],
                                itemStyle: {
                                    normal: {
                                        color: '#2EC7C9'
                                    }
                                }
                            },
                            markLine: {
                                data: [{
                                    type: 'average',
                                    name: '平均值'
                                }],
                                itemStyle: {
                                    normal: {
                                        color: '#2EC7C9'
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#2EC7C9',
                                    lineStyle: {
                                        color: '#2EC7C9'
                                    }
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
                $(window).resize(myChart.resize);

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
            save: function ($index, pace) {
                var self = this;
                var _data = JSON.parse(JSON.stringify(self.listdata.items[$index]));

                if (_data.TSMPace > 100 || _data.TSMPace < 0) {
                    toastr.error('任务进度不能超过100且不可小于0！');
                    return;
                }

                if (pace == 1) _data.TSMPace = 100;

                $.ajax({
                    url: '/home/SaveSubList',
                    data: _data,
                    type: 'POST',
                    success: function (re) {
                        commonMethods.toastr.request(re, function () {
                            _data.TSMFlag = re.item.TSMFlag;
                            self.$set('listdata.items[' + $index + ']', _data);
                            self.$set('listdata.editIndex', -1);
                        });
                    }
                });
            },
            //分页
            pageInitA: function (opt, cb) {
                var self = this;
                $('.J-Pagination').pagination({
                    listStyle: 'pagination',
                    prevText: '<i class="fa fa-angle-left"></i>',
                    nextText: '<i class="fa fa-angle-right"></i>',
                    itemsOnPage: opt.pageSize || 10,
                    items: opt.counts,
                    currentPage: opt.pageIndex,
                    onPageClick: function (page, event) {
                        list.vm.getData(page);
                    }
                });
            },
            // 排序搜索
            getOrderData: function (tabId, param) { // tabId: 1、vuelist排序 2、其他列表排序（默认1）
                var self = this;
                var $form = $('#tab-' + 　tabId).find('form');
                var $orderType = $form.find('[name="orderType"]');

                $form.find('[name="orderItem"]').val(param);
                $orderType.val($orderType.val() == 0 ? 1 : 0);

                if (tabId == 1) {
                    self.getData(1, 'unwanted');
                } else {
                    self.getOtherPage(tabId);
                }
            },

            // 获取其他tab内列表
            getOtherPage: function (tabId) { // tabId：2、接受分配任务  3、线上BUG
                var self = this;
                if (self.canSearch == 0) return;

                commonMethods.progressBar.showProgressBar('Success');
                var $form = $('#tab-' + 　tabId).find('form');

                self.canSearch = 0;

                $.ajax({
                    url: '/home/GetHomeOtherPage?reqType=' + tabId,
                    data: $form.serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success: function (re) {
                        self.$set('otherPageList' + tabId, re);

                        commonMethods.progressBar.removeProgressBar();

                        setTimeout(function () {
                            self.canSearch = 1;
                            commonMethods.tooltip();
                        }, 500);

                        if (tabId == 2) { //给未分配任务设置分页
                            self.pageInit({
                                el: $form.closest('.J-Pane').find('.J-Pagination'),
                                size: re.pagesize,
                                count: re.count,
                                index: re.pageindex,
                            }, function (page, event) {
                                $form.find('[name="pageindex"]').val(page);
                                self.getOtherPage(tabId);
                            });
                        }
                    }
                });
            },

            // 其他列表页面的重置
            clearOtherPage: function (tabId) {
                var self = this;
                var $form = $('#tab-' + 　tabId).find('form');
                $form.find('input,select').val('').trigger('change');
                self.getOtherPage(tabId);
            },

            // BUG的筛选
            searchBug: function (role) { // role：1：分配人是自己、2：经办人是自己
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
        vueUrl: '/home/MyTask',
        vuePageSize: 10,
        needlocalData: 1,
        vueMixins: [home],
        vueCallback: function (re, _self) {
            // home.methods.pageInitA(re);
            // home.methods.buildEC(re.tab2.length);
            console.log(re);
        },
    });
})();