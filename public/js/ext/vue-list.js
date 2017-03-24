Vue.filter('vFormatDate', function (value, str) {//时间格式过滤器
    if(!str) str = "";
    if (value == null || value == '/Date(-2209017600000)/' || value == '/Date(631123200000)/') return str;
    return __dataFormat.dateToStr(value) || '';
});
Vue.filter('vMatchtData', function (value, type) {//数据匹配过滤器
    var self = this;
    if (value == null) return;
    return self.$data.fakedata[type][value] || '';//键值对
});

// 多个label标签缩进组件
Vue.component('badgecomp', {
    data: function(){
        return {
            arr_badge: [],
            str_badge: ""
        }
    },
    props: {
        badge: null,
        count: Number,
    },
    template: '<span v-for="item in arr_badge" class="badge badge_{{item.key % 4 + 1}}">{{item.val}}</span>' +
              '<span v-if="str_badge" style="cursor:pointer" data-toggle="tooltip" title="{{str_badge}}"><i class="fa fa-ellipsis-h"></i></span>',
    ready: function () {
        var self = this;
        var badge = self.badge || [];
        var arr_badge = [];
        var str_badge = '';

        $.each(badge, function (i, v) {
            if((i + 1) > self.count){
                str_badge += (str_badge ? ',' : '') +  v.val;
            }else{
                arr_badge.push(v);
            }
        });
        self.$set('arr_badge', arr_badge);
        self.$set('str_badge', str_badge);
    }
});

// 列表查询按钮组件
Vue.component('search-btn', {
    props: ['className', 'clearSearch', 'exportUrl', 'offset', 'opt'],
    template: '<div class="{{className}}">' +
        '<div class="form-group form-group-sm"> ' +
            '<div class="col-md-12 col-md-offset-{{offset || 4}}"> ' +
                '<a href="javascript:;" class="btn btn-sm btn-primary" v-on:click="$root.getData(1, ' + "'unwanted'" + ');"><i class="fa fa-search"></i>&nbsp;查询</a> ' +
                '<a href="javascript:;" class="btn btn-sm btn-primary" v-on:click="$root.clearSearchData();" v-if="clearSearch"><i class="fa fa-circle-thin"></i>&nbsp;重置</a> ' +
                '<a href="javascript:;" class="btn btn-sm btn-primary" v-on:click="$root.exportFile(exportUrl);" v-if="exportUrl"><i class="fa fa-file-excel-o"></i>&nbsp;导出</a>' +
                '{{{opt}}}' +
            ' </div>' +
        '</div>' +
    '</div>' +
    '<div class="clearfix"></div>'
});

//列表组件
function vueList(params) {
    var defaultSetting = {
        data: {},
        vueId: "#listApp",
        vueUrl: null,
        vueForm: $("#SearchForm"),
        vueMixins: [],
        vuePageSize: 15,
        vueInitSearch: true,
        needlocalData: 0, // 是否需要保留搜索值（0：不需要，1：需要）
        vueCallback: function () {
        },
        beforeInit: function(){
        }
    };

    var option = $.extend(true, {}, defaultSetting, params || {});

    /* 获取初始化存储在local内的form表单值 */
    localStorage.setItem('uselocalData', 1); // 初始化是否使用local值标志位
    var pageName = window.location.href.split('?')[0].replace(/\/|http|\:|\./g, '');
    var searchData = localStorage.getItem(pageName + '_data');
    var obj_data = __dataFormat.toObj(decodeURIComponent(searchData), '&', '=');
    var data = $.extend({}, option.data,{
        searchData: obj_data,
        canSearch: 1 ,// 是否查询标识位
        page :1 
    });

    this.vm = new Vue({
        el: option.vueId,
        data: data,
        init: function () {
            if(typeof option.beforeInit == "function"){
                option.beforeInit.call(this)
            }
            $.each(obj_data, function (k, v) {
                if (!k) return;
                option.vueForm.find('[name="' + k + '"]').val(v).attr('data-val', v);
            });
        },
        ready: function(){
            //初始化查询
            if (option.vueInitSearch) this.getData(1);
        },
        methods: {
            getData: function (_pageIndex, _uselocalData) {// _pageIndex设置默认页数 // _uselocalData是否使用local做搜索值
                var self = this;
                if (self.canSearch !== 1) return;
                searchData = localStorage.getItem(pageName + '_data');
                self.canSearch = 0;
                commonMethods.progressBar.showProgressBar('Success');
                $.ajax({
                    url: option.vueUrl,
                    data: {
                        "pageIndex":_pageIndex,
                        "pageSize":option.vuePageSize,
                        "orderField":'',
                        "orderIndex":'',
                        "TMIsValid":"1"
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (re) {
                        self.$set('listdata', re);
                        option.vueCallback(re,self);
                        commonMethods.progressBar.removeProgressBar();
                        self.pageInit(re.tab1)
                        setTimeout(function(){
                            commonMethods.tooltip();
                        }, 200);

                    }
                });
            },
            //分页
            pageInit: function (opt ,cb) {
                var self = this;
                $('.J-Pagination').pagination({
                    listStyle: 'pagination',
                    prevText: '<i class="fa fa-angle-left"></i>',
                    nextText: '<i class="fa fa-angle-right"></i>',
                    itemsOnPage: opt.pageSize || 10,
                    items: opt.counts,
                    currentPage: opt.pageIndex,
                    onPageClick: function(page, event){
                        self.getData(page, event);
                        self.canSearch =1;
                    }
                });
            },
            //导出报表
            exportFile: function (exportUrl) {
                var _str = option.vueForm.serialize();
                var _url = decodeURI(exportUrl + (_str ? '?' + _str : ''));
                window.open(_url);
            },
            //清空按钮内的编辑
            clearSearchData: function () {
                var self = this;
                option.vueForm.find('input,select').val('').trigger('change');
                self.canSearch = 1;
                self.getData(1, 'unwanted');
            },
        },
        mixins: option.vueMixins
    });
}