; (function ($) {
    if (!Vue) return;
    var self;
    Vue.directive('icheck', {//icheck指令
        bind: function () {
            self = this;
            var $el = $(self.el);
            var _obj = __dataFormat.toObj(self.expression);
            var _initData = self.vm.$get(_obj.valKey);
            var arr_initData = (_initData || _initData == 0) ? _initData.toString().split(',') : [];

            if ($el.find('input').length <= 0) {
                var _str = '';
                $.each(self.vm.$get(_obj.dataKey), function (i, v) {
                    _str += '<label class="' + _obj.type + '-inline">' +
                                '<input type="' + _obj.type + '" name="' + _obj.name + '" value="' + i + '">' + v +
                            '</label>'
                });
                $el.append(_str);
            }
            var _icheck = $el.find('input');

            _icheck.addClass('J-icheck');
            _icheck.attr('data-key', _obj.valKey);

            $.each(arr_initData, function (i, v) {//赋默认值
                $.each(_icheck, function (_i, _v) {
                    if (v == _v.value) {
                        $(_v).attr({ 'checked': 'checked' });
                        return false;
                    }
                });
            });

            $el.iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
            if (_obj.disable == 'disable') {
                $el.iCheck('disable');
            }
        }
    });

    $('body').on('ifChanged', '.J-icheck', function (e) {
        var $el = $(e.target);
        var _val = $el.val();
        var _name = $el[0].name;
        var _type = $el[0].type;
        var _key = $el.attr('data-key');

        if (_type == 'checkbox') {
            var arr_data = [];
            $.each($('[name=' + _name + ']'), function (i, v) {
                if (v.checked) arr_data.push(v.value);
            });
            _val = arr_data.join(',');
        }
        self.vm.$set(_key, _val);
    });
}(jQuery))