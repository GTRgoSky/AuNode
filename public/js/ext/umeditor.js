// 暂时不做配置，仅简单支持

var Vue = Vue || null;
(function () {

    // 若是没有vue那么进行JS钩子DOM操作
    $.each($('.J-Umeditor'),function(i, v){

        v.id = v.id || 'umeditor' + i;
        var $el = $(v);
        $el.css('min-height', '240px');
        var umr = UM.getEditor(v.id, {
            toolbar: [
                'undo redo | bold italic underline strikethrough | forecolor backcolor',
                '| selectall cleardoc paragraph | fontsize',
                '| justifyleft justifycenter justifyright justifyjustify',
                '| image fullscreen',
            ],
            initialFrameWidth: '100%',
        });

        umr.ready(function () {

            // 兼容JQvalidate的验证，元素不可为display:none
            $el.addClass('edui-content-textarea');
            // textarea不需要赋值
            // umr.setContent($el.attr('data-umeditor'));

            umr.addListener('selectionchange', function () {
                // console.log(umr.getContent());
            });

            umr.addListener('fullscreenchanged', function(){
                var _con = $(this.container);
                if(this._edui_fullscreen_status){
                    _con.addClass('edui-container-fullscreen');
                    this.$body.height(this.$body.height() - 121);
                }else{
                    _con.removeClass('edui-container-fullscreen');
                }
            });
        });
    });

    if(!Vue) return;
    Vue.directive('umeditor', {
        bind: function () {
            var self = this;
            var $el = $(self.el);
            var _obj = __dataFormat.toObj(self.expression);
        }
    });
})();