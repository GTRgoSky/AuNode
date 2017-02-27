(function (win) {
    var _limit = null;
    function CustomDateTimePicker(obj) {
        var defaultSetting = {
            _el: $('.J-DateTimePicker'),//el
            _format: 'Y-m-d H:i',//显示格式
            _type: null,//时间日期选择器类型(1为时间日期全可选，2为日期选择器，3为时间选择器)
            _step: 60,//时间选择器的间隔时间
            _isRange: null,
            _minDate: null
        };
        this.option = $.extend(true, {}, defaultSetting, obj || {});

        this.option._typeJudge = function (self) {
            var _type = self._type;
            var _range = self._isRange;
            if (_type == 1) {//选择器的类型(1为时间日期全可选，2为日期选择器，3为时间选择器)
                self._datepicker = true;
                self._timepicker = true;
                self._format = 'Y-m-d H:i';
                if (_range == 1) {//是否是时间范围选择器(1.为开始时间选择器，2为结束时间选择器)
                    _limit = function () {
                        this.setOptions({
                            maxDate: $(self._el).siblings('input').val() ? $(self._el).siblings('input').val().substr(0, 10).replace(/\-/gi, '/') : false,
                            //onSelectTime: function (current_time, $input) {
                            //    console.log(current_time, $input);
                            //}
                        });
                    }
                } else if (_range == 2) {
                    _limit = function () {
                        this.setOptions({
                            minDate: $(self._el).siblings('input').val() ? $(self._el).siblings('input').val().substr(0, 10).replace(/\-/gi, '/') : false,
                            //onSelectTime: function (current_time, $input) {
                            //    console.log(current_time, $input);
                            //}
                        });
                    }
                }
            } else if (_type == 2) {
                self._datepicker = true;
                self._timepicker = false;
                self._closeOnDateSelect = true;
                self._format = 'Y-m-d';
                if (_range == 1) {//是否是时间范围选择器(1.为开始时间选择器，2为结束时间选择器)
                    _limit = function () {
                        this.setOptions({
                            maxDate: $(self._el).siblings('input').val() ? $(self._el).siblings('input').val().replace(/\-/gi, '/') : false
                        });
                    }
                } else if (_range == 2) {
                    _limit = function () {
                        this.setOptions({
                            minDate: $(self._el).siblings('input').val() ? $(self._el).siblings('input').val().replace(/\-/gi, '/') : false
                        });
                    }
                }
            } else if (_type == 3) {
                self._datepicker = false;
                self._timepicker = true;
                self._format = 'H:i';
                if (_range == 1) {//是否是时间范围选择器(1.为开始时间选择器，2为结束时间选择器)
                    _limit = function () {
                        this.setOptions({
                            maxTime: $(self._el).siblings('input').val() ? $(self._el).siblings('input').val() : false
                        });
                    }
                } else if (_range == 2) {
                    _limit = function () {
                        this.setOptions({
                            minTime: $(self._el).siblings('input').val() ? $(self._el).siblings('input').val() : false
                        });
                    }
                }
            }
        }
        this.option._typeJudge(this.option);

        //console.log(this.option)

        this.init();
    }
    CustomDateTimePicker.prototype = {
        init: _init
    }
    function _init() {
        var self = this;
        self.option._el.datetimepicker({
            lang: 'zh',//显示语言
            format: self.option._format,
            datepicker: self.option._datepicker,
            timepicker: self.option._timepicker,
            closeOnDateSelect: self.option._closeOnDateSelect,
            step: ~~self.option._step,
            onShow: _limit,
            minDate: self.option._minDate || false,
            scrollInput:false
        });
    }
    win.CustomDateTimePicker = CustomDateTimePicker;
})(window);

var Vue = Vue || null;
(function () {
    // clear choose date
    $('body').on('click', '.J-ClearDate', function () {
        $(this).parent().siblings("input").val('').trigger('change');
    });

    // 若是没有vue那么进行JS钩子DOM操作
    $.each($('.J-DateTimePicker'),function(i, v){
        var $el = $(v);
        var _obj = __dataFormat.toObj($el.attr('data-datetimepicker'));
        new CustomDateTimePicker({
            _el: $el,//el
            _step: _obj.step || 60,
            _type: _obj.type || 1,
            _minDate: _obj.minDate || '',
        });
    });

    // 若是没有vue那么进行JS钩子DOM操作
    $.each($('.J-DateTimePickerRange'),function(i, v){
        var $el = $(v);
        var _obj = __dataFormat.toObj($el.attr('data-datetimepicker'));
        var $el_begin = $el.find('input').eq(0);
        var $el_end = $el.find('input').eq(1);

           setTimeout(function () {
                new CustomDateTimePicker({
                    _el: $el_begin,//el
                    _step: _obj.step || 60,
                    _type: _obj.type || 2,
                    _isRange: 1
                });
                new CustomDateTimePicker({
                    _el: $el_end,//el
                    _step: _obj.step || 60,
                    _type: _obj.type || 2,
                    _isRange: 2
                });
            }, 600)
    });

    if(!Vue) return;

    Vue.directive('datetimepicker', {
        bind: function () {
            var _obj = __dataFormat.toObj(this.expression);
            var $el = $(this.el);
            new CustomDateTimePicker({
                _el: $el,//el
                _step: _obj.step || 60,
                _type: _obj.type || 1,
            });
        }
    });

    Vue.directive('datetimepicker_range', {
        bind: function () {
            var _obj = __dataFormat.toObj(this.expression);
            var $el = $(this.el);
            var $el_begin = $el.find('.J-DateTimePickerStart');
            var $el_end = $el.find('.J-DateTimePickerEnd');
            //console.log(_obj);

           setTimeout(function () {
                new CustomDateTimePicker({
                    _el: $el_begin,//el
                    _step: _obj.step || 60,
                    _type: _obj.type || 1,
                    _isRange: 1
                });
                new CustomDateTimePicker({
                    _el: $el_end,//el
                    _step: _obj.step || 60,
                    _type: _obj.type || 1,
                    _isRange: 2
                });
            }, 600)
        }
    });
})();