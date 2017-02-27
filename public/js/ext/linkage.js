/*! 
 * 在一部分linkage外层设置作用域 ‘J-linkAgeBox’
 * 页面的话需要都是用select标签
 * vue控件内需要在指令之后加参数 格式---- v-linkage="{key1:***,key2:***}"
 */

(function () {
    if (Vue) {
        var optionStr = '<option value="">--请选择--</option>';
        var clearSelect;
        Vue.directive('linkage', {//多级联动指令
            bind: function () {
                var
                self = this,
                $el = $(self.el),
                _obj = __dataFormat.toObj(self.expression);
                _obj['pel'] = $el.closest('.J-linkAgeBox').length > 0 ? $el.closest('.J-linkAgeBox') : $('body');//作用域（获取父元素）

                $el.addClass('J-linkage').attr({ 'data-level': _obj.level, 'data-key': _obj.key, 'data-url': _obj.url }).append(optionStr);

                if (_obj.level == 1) {//初始化第一级联动
                    _obj['el'] = $el;
                    _obj['val'] = 1;
                    getLinkAgeData(_obj);
                }

                $el.change(function () {
                    var $el = $(this);

                    _obj['val'] = $el.val();
                    _obj['txt'] = $el.find(':selected').text();
                    _obj['el'] = _obj.pel.find('.J-linkage[data-level=' + (parseInt(_obj.level) + 1) + ']');//此时作用的对象是联动下一级
                    _obj['url'] = _obj.el.attr('data-url');

                    /*给VM赋值*/
                    self.vm.$set(_obj.key, _obj.txt == '--请选择--' ? '' : _obj.txt);
                    self.vm.$set(_obj.key + 'Id', _obj.val);

                    /*对下级的select清空*/
                    clearSelect(_obj);

                    /*对最后一级不请求*/
                    if (_obj.el.length > 0 && _obj.val) getLinkAgeData(_obj);
                });

                clearSelect = function (obj) {
                    $.each(obj.pel.find('.J-linkage'), function (i, v) {
                        if ($(v).attr('data-level') > parseInt(obj.level)) {
                            $(v).val('').html(optionStr);
                            self.vm.$set($(v).attr('data-key'), '');
                            self.vm.$set($(v).attr('data-key') + 'Id', '');
                        }
                    });
                }
            }
        });

        //$('.J-ClearSelectAll').click(function () {
        //    $.each($('.J-linkage'), function (i, v) {
        //        clearSelect($(v));
        //    });

        //    var $el = $('.J-linkage[data-level=1]');
        //    var _obj = {
        //        el: $el,
        //        url: $el.attr('data-url'),
        //        val: '1'
        //    }

        //    getLinkAgeData(_obj);
        //});

        function getLinkAgeData(obj) {
            $.ajax({
                url: obj.url + '?key=' + obj.val,
                type: 'POST',
                success: function (re) {
                    var optStr = optionStr;
                    $.each(re.items, function (i, v) {
                        optStr += re.items.constructor == Array ? '<option value="' + v + '">' + v + '</option>' : '<option value="' + v.id + '">' + v.name + '</option>';
                    });
                    obj.el.html(optStr);
                }
            });
        }
    }
})();