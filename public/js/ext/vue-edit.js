
//编辑组件
function vueEdit(params) {
    var defaultSetting = {
        vueApp: "#vueEdit",//el
        data: {},//可接收外来配置，以此来扩展默认的配置数据
        vueChangeDataUrl: null,//编辑页面获取数据接口
        vueChangeSaveUrl: null,//编辑页面保存数据接口
        vueEditSaveUrl: null,//新增页面获保存据接口
        vueParentUrl: null,//是否存在需要返回列表页面
        vueEditId: null,//对应项ID,
        beforeValid: function(){},
        vueCallback: function () { },//对请求回来的数据进行一些修改，node之后应该是不太会用到这个方法了
        vueSubCallback: function () { },//当需要修改一些提交数据时可以调用此方法
        vueMixins: []
    }
    var option = $.extend(true, {}, defaultSetting, params || {});
    option.vueType = option.vueEditId ? 1 : 0;//页面类型（0为新增，1为编辑）

    //若是编辑页面则先进行请求，加载数据使用vue
    commonMethods.progressBar.showProgressBar('', 2);//过渡动画
    if (option.vueType == 0) {//新增页面 0为新增页面，1为编辑页面
        var _re = option.vueCallback() || {};
        newVueEdit(_re);
    } else {
        $.ajax({
            url: option.vueChangeDataUrl,
            data: {
                id: option.vueEditId
            },
            type: 'POST',
            dataType: 'json',
            success: function (re) {
                _re = option.vueCallback(re) || re;
                newVueEdit(_re)
            }
        });
    }

    function newVueEdit(_re) {
        var data = $.extend({}, {
                    tabledata: _re,
                    viewdata: option,
                    cansub:1
                }, option.data);
        vueEdit = new Vue({
            el: option.vueApp,
            data: data,
            methods: {
                submit: function (_refreshUrl) {//保存数据 _refreshUrl：保存结束后跳转页面的链接
                    var self = this;
                    if (self.cansub == 1) {
                        self.cansub = 0;
                        var _url = option.vueType == 0 ? option.vueEditSaveUrl : option.vueChangeSaveUrl;
                        _refreshUrl = _refreshUrl || option.vueParentUrl;
                        option.beforeValid(self.$data.tabledata);
                        if ($('.J_valid').length) {//验证
                            var str_valid = "";
                            if ($('.J_valid').eq(0).text() != "") {
                                str_valid = $('.J_valid').eq(0).text();
                            } else {
                                str_valid = $('.J_valid').eq(0).closest('.form-group').find('.red').prev().text() + '不能为空！';
                            }
                            parent.toastr.error(str_valid);
                            self.cansub = 1;
                            return;
                        }

                        option.vueSubCallback(self.$data.tabledata);
                        return
                        $.ajax({
                            url: _url,
                            type: "POST",
                            dataType: "json",
                            data: self.$data.tabledata,
                            success: function (re) {
                                commonMethods.toastr.request(re,function(){
                                    self.cansub = 1;
                                    setTimeout(function(){
                                        if (_refreshUrl) parent.location.href = _refreshUrl;
                                    }, 100);
                                });
                            }
                        });
                    }
                }
            },
            mixins: option.vueMixins
        });
        commonMethods.progressBar.removeProgressBar();
    }
}