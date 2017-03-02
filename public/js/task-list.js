(function () {
    var list = {
        $els: {
            form: $('.J-SearchForm'),
            listBox: $('.J-TableBox'),
            searchBtn: $('.J-SearchBtn'),
            orderIndex: $('.J-OrderIndex'),
            orderField: $('.J-OrderField'),
        },
        init: function () {
            var self = this;
            
            self.getList();

            self.$els.searchBtn.click(function () {
                self.getList();
            });
            if (self.ccc('msg')=='err'){
                toastr.warning('您没有权限,请找管理员开通!')
            }
            $('body')
                .on('click', '.J-SetValid', function () {
                    self.setValid($(this));
                })
                .on('click', '.J-SetOrder', function () {
                    self.setOrder($(this));
                })
                .on('click', '.J-ReSet', function () {
                    self.$els.form.find('input,select').val('').trigger('change');
                    self.$els.form.find('[name=TMIsValid]').val(1).trigger('change');
                    self.getList();
                });
        },
        ccc: function (name) {
            //获取Url头部
            var c = {}
            var url=location.href;
            url.split('?')[1].split('&').forEach(item => {
                c[item.split('=')[0]] = item.split('=')[1]
            });
            return c[name]
        },
        getList: function (pageIndex) {
            var self = this;
            $.ajax({
                url: '/Task/List',
                data: self.$els.form.serialize() + '&pageIndex=' + (pageIndex || 1) + '&pageSize=10',
                type: 'POST',
                success: function (re) {
                    self.$els.listBox.html(re.html);
                    self.pageInit(re);
                }
            });
        },
        //分页
        pageInit: function (opt, cb) {
            var self = this;
            $('.J-Pagination').pagination({
                listStyle: 'pagination',
                prevText: '<i class="fa fa-angle-left"></i>',
                nextText: '<i class="fa fa-angle-right"></i>',
                itemsOnPage: opt.pageSize || 10,
                items: opt.counts,
                currentPage: opt.pageIndex,
                onPageClick: function (page, event) {
                    self.getList(page);
                }
            });
        },

        // 设置任务有效性
        setValid: function ($el) {
            var self = this;

            var _type = $el.attr('data-valid'); // 1为恢复 2为无效

            layer.confirm('确定' + (_type == 1 ? '恢复' : '删除') + '任务 <span class="text-danger">' + $el.attr('data-title') + '</span> ？', {
                icon: 0,
                title: '警告！',
            }, function () {

                $.ajax({
                    url: '/Task/SetValid?id=' + $el.attr('data-id') + '&type=' + $el.attr('data-valid'),
                    type: 'Get',
                    success: function (re) {

                        layer.closeAll();

                        toastr[re.status == 1 ? 'info' : 'warning'](re.msg);

                        setTimeout(function () {
                            self.getList();
                        }, 500);

                    }
                });
            });
        },

        // 排序
        setOrder: function ($el) {
            var self = this;
            var field = $el.attr('data-field');
            var pField = self.$els.orderField.val();
            var pOrder = self.$els.orderIndex.val();

            self.$els.orderField.val(field);
            self.$els.orderIndex.val(pField == field && pOrder == 1 ? -1 : 1);

            self.getList();
        },


    };

    list.init();
})();