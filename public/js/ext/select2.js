/**
 * 
 * select2的二次封装
 * 更多详情可以关注 https://select2.github.io/examples.html
 * @param : el              : {[object]}        : [作用DOM]
 * @param : key             : {[array]}         : [初始化默认值填充]
 * @param : placeholder     : {[string]}        : [无值时的文案]
 * @param : multiple        : {[boolean]}       : [是否多选，可以在DOM标签内直接写multiple属性来代替]
 *
 * @param : callback_choose : {[function]}      : [对select2选择结果的一个回调]
 *
 * @param : aysn            : {[object]}        : [异步模糊查询]
 * @param : aysn.url        : {[string]}        : [异步接口]
 * @param : aysn.minlength  : {[string || num]} : [最小搜索长度]
 *
 * @return {[type]}     [description]
 */
(function () {
    function CustomSelect2(obj) {
        var defaultSetting = {
            el: $('.J-Select2'),
            key: [],
            multiple: false,
            placeholder: '--请选择--',
            aysn: {
                url: '',
                minlength: '1',
            },
            callback_choose: function (re) { }
        };
        var opt = $.extend(true, {}, defaultSetting, obj || {});
        init(opt);
    }
    function init(opt) {
        if(opt.el.length <= 0) return;
        var obj = {};
        if(opt.aysn.url){
            obj = {
                minimumInputLength: opt.aysn.minlength,
                ajax: {
                    url: opt.aysn.url,
                    dataType: 'json',
                    delay: 250,
                    data: function (params) { //传参
                        return {
                            key: params.term,
                            page: params.page
                        };
                    },
                    processResults: function (data, params) { //请求返回数据
                        params.page = params.page || 1;

                        if (data.items.constructor == Array) {
                            $.each(data.items, function (i, v) {
                                v['text'] = (v.name || v.text);
                            });
                        }
                        return {
                            results: data.items || data.id,
                            pagination: {
                                more: (params.page * 30) < data.total_count
                            }
                        };
                    },
                    // templateResult: function (a, b) { //模糊查询请求返回数据
                    //     return a.name || opt.placeholder;
                    // }
                }
            };
        }
        if(opt.key.length > 0 || opt.key.constructor == Number){
            // 为initSelect赋值
            obj['initSelect'] = opt.aysn.url ? (function ($el) { //异步
                if(opt.key.constructor == Array){ //多选
                    opt.key = opt.key.join(',');
                }
                $.ajax({
                    url: opt.aysn.url + '?key=' + opt.key,
                    type: 'GET',
                    success: function (re) {
                        var _str = '';
                        $.each(re.items, function (i, v) {
                            _str += '<option value="' + v.id + '">' + (v.text || v.name) + '</option>';
                        });
                        $el.append(_str).val(opt.key.constructor == Array ? opt.key : (opt.key + '').split(',')).trigger('change');
                    }
                });
            }) : (function ($el) { //同步
                var _val;
                if(opt.key.constructor == Array){ //多选
                    var _arr = [];
                    $.each(opt.key, function(i, v){
                        _arr.push(v);
                    });
                    _val = _arr;
                }else{ //单选
                    _val = opt.key;
                }
                $el.val(_val).trigger('change');
            });
        }

        var selSetting = {
            language: 'zh-CN',
            allowClear: true,
            placeholder: opt.el.attr('placeholder') || opt.placeholder,
            multiple: opt.multiple || opt.el[0].multiple,
            escapeMarkup: function (markup) {
                return markup;
            },
            templateSelection: function (a, b) { //对返回数据选择后选项
                return '<span class="J-S2Result" value="' + a.id + '">' + (a.name || a.text) + '</span>';
            }
        };

        var selSetting = $.extend(true, {}, selSetting, obj);
        //实例化
        opt.el.val('').select2(selSetting);
        //初始化
        if(obj.initSelect) obj.initSelect(opt.el);
        //change事件回调
        opt.el.on('change', function(evt){
            var $el = $(evt.target)
            opt.callback_choose({
                el: $el,
                val: $el.val(),
                text: $el.find(':selected').text(),
                event: evt
            });
        });
    }
    window.CustomSelect2 = CustomSelect2;
})();

var Vue = Vue || null;
(function () {

    $('body').on('click', '.J-Select2MySelf', function () {
        var $el = $(this).closest('.input-group').find('select');
        $el.append('<option value="' + commonInfo.JobNumber + '">' + commonInfo.UserName + '</option>')
        $el.val(commonInfo.JobNumber).trigger('change');
    });

    // 若是没有vue那么进行JS钩子DOM操作
    $.each($('.J-Select2Request'),function(i, v){
        var $el = $(v);
        var _obj = __dataFormat.toObj($el.attr('data-select'));
        new CustomSelect2({
            el: $el,
            aysn: {
                url: _obj.url
            },
            key: _obj.key
        });
    });

    if(!Vue) return;
    Vue.directive('select2', {//非异步的select2(多选在标签内添加multiple属性)
        params: ["val"],
        bind: function () {
            var self = this;
            var $el = $(self.el);
            var key;
            if ($el.data("val")) {
                key = $el.data("val") || [];//容错处理
            } else {//这里扩展用来接收动态数据
                key = self.params["val"] || [];//容错处理
                if(typeof key == "string"){//接收多种类型，提高灵活性
                    key = key.split(",");
                }
            }
            new CustomSelect2({
                el: $el,
                key: key
            });
        }
    });

    Vue.directive('select2_request', {//异步的select2(多选在标签内添加multiple属性)
        bind: function () {
            var self = this;
            var $el = $(self.el);
            var _obj = __dataFormat.toObj(self.expression);

            $el.addClass('J-SelectRequest');

            new CustomSelect2({
                el: $el,
                aysn: {
                    url: _obj.url
                },
                key: _obj.key || $el.attr('data-val')
            });
        }
    });
})();