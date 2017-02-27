// 数据处理
var __dataFormat = {
    toObj: function (str, spliceKey, linkKey) {//字符串转对象,

        if (!str) return {};

        var _esc = '*.?+$^[](){}|\/';// 所有需要转译的字符
        var _obj = {};
        var spliceKey = spliceKey || ',';
        var linkKey = linkKey || ':';
        var _str = str.replace(/(^\?|\{)/, '').replace(/\}$/, '');// ? { } 符号的去除
        //var _str = str.replace(/^\[(.*)\]$/, "\{$1\}");
        var _arr = _str ? _str.split(spliceKey) : [];
        var _reg = new RegExp('^.*?(?=' + (_esc.indexOf(linkKey) > -1 ? '\\' : '') + linkKey + ')'); // 生成对应的正则

        $.each(_arr, function (i, v) {
            if (!v.match(_reg)) return;

            var _key = v.match(_reg)[0];
            var _val = v.replace(_reg, '').substr(1);

            if(_obj[_key] !== undefined){
                if(_obj[_key].constructor == Array){
                    _obj[_key].push(_val);
                }else{
                    _obj[_key] = [_obj[_key], _val];
                }
            }else{
                _obj[_key] = _val;
            }
        });
        return _obj;
    },
    dateToStr: function (datetime) {//时间戳转y-m-d h:m:s
        datetime = datetime.match(/\d|-/g,'').join('');
        datetime = new Date(parseInt(datetime));
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        var hour = datetime.getHours();
        var minutes = datetime.getMinutes();
        var second = datetime.getSeconds();
        month = ('0' + month).substr(-2);
        date = ('0' + date).substr(-2);
        hour = ('0' + hour).substr(-2);
        minutes = ('0' + minutes).substr(-2);
        second = ('0' + second).substr(-2);
        var time = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + second;
        return time;
    },
    get_unix_time: function (dateStr) {//y-m-d转时间戳
        var newstr = dateStr.replace(/-/g, '/');
        var date = new Date(newstr);
        var time_str = date.getTime().toString();
        return time_str.substr(0, 10);
    }
};

// 公用方法
var commonMethods = {
    init: function(){
        // this.checkBrowser();
        this.domBind();
        this.tooltip();
        this.toastr.setOption();
        // this.setCont();

        // $(window).resize(this.setCont);

        // if(commonInfo.IsOnline == 'true') $('.J-VueJson').addClass('hide');

    },

    /**
     * 设置Frame的高度以及宽度！
     */
    setCont: function(){
        var WHeight = $(window).height();
        var FHeight = $('.J-FrameFoot').height();
        var HHeight = $('.J-FrameHead').height();

        var WWidth = $(window).width();
        var NWidth = $('.J-FrameSideNav').width();

        $('.J-FrameCont').height(WHeight - FHeight - HHeight - 62).width(WWidth - NWidth).css({'margin-top': HHeight, 'margin-left': NWidth, 'display': 'block'});
    },

    /**
     * DOM绑定事件
     */
    domBind: function(){
        var self = this;

        $('body')
            .on('click', '.J-ActionLink', function () {//单击请求事件（删除、编辑、保存按钮等等）
                /**
                 *若果为弹框iframe则需要传data-type="iframe"以示区别
                 *data-异步需要提交的数据
                 *link-请求链接或iframe页面地址//必填项
                 *head-弹框抬头
                 *text-提示时的文本
                 *type-弹框类型
                 */
                var
                _ele = $(this),
                _info = {
                    type: _ele.attr('data-type') || 'confirm',
                    link: _ele.attr('data-link'),
                    head: _ele.attr('data-head') || '信息',
                    text: _ele.attr('data-text') || '确定进一步操作？',
                    data: _ele.attr('data-data') ? JSON.parse(_ele.attr('data-data')) : {},
                    size: _ele.attr('data-size') ? _ele.attr('data-size').split(',') : ['70%', '87%'],
                    dom : _ele.attr('data-dom') ? $(_ele.attr('data-dom')) : ''
                };

                if(!_info.link && !_info.dom) return;

                if (_info.type == 'confirm') {
                    layer.confirm(_info.text,
                        {
                            icon: 0,
                            title: _info.head
                        }, function () {
                            $.ajax({
                                url: _info.link,
                                type: 'POST',
                                data: _info.data,
                                success: function (re) {
                                    commonMethods.toastr.request(re, function(){
                                        setTimeout(function(){
                                            window.location.reload();
                                        }, 500);
                                    }, function(){
                                        layer.closeAll();
                                    });
                                }
                            });
                        });
                } else if (_info.type == 'iframe') {
                    layer.open({
                        type: _info.dom ? 1 : 2,
                        title: _info.head,
                        maxmin: true, // 窗口最大最小化 默认false
                        shadeClose: true,
                        shade: 0.8,
                        area: _info.size,
                        content: _info.dom || _info.link //iframe的url
                    });
                }
            })
            .on('click', '.J-CheckAll', function () {//单选反选
                var
                $el = $(this),
                _check = $el[0].checked,
                _name = $el.attr('data-name');

                if (!_name) return;

                var $checkc = $('.J_checkItem[data-name=' + _name + ']');
                $.each($checkc, function (i, v) {
                    if (v.checked != _check) {
                        $(v).trigger('click');
                    }
                });
            })
            .on('click', '.J-ToNormalAu', function(){// 跳转老版本极光
                window.location.href = 'http://' + window.location.hostname + ':8005/AU?AUFlag=1';
            });
    },

    /**
     * 浏览器验证
     */
    checkBrowser: function(){
        var arr_browser = ['Chrome', 'Firefox'];
        var explorer = navigator.userAgent;
        var canshow = 0;
        for (var i = 0; i < arr_browser.length; i++) {
            var v = arr_browser[i]
            if (explorer.indexOf(v) >= 0) {
                canshow = 1;
                return false;
            }
        }
        if (canshow == 0) {
            window.location.href = '/Home/Illegal?type=1';
            return;
        }
    },

    /**
     * 获取地址栏参数
     * @param  {string} name 参数名
     * @return {string}
     */
    getUrlQuery: function(name) {
        var params = {};
        var arr = window.location.search.substr(1).split('&');
        for (var i = 0; i < arr.length; i++) {
            params[arr[i].split("=")[0].toLowerCase()] = arr[i].split("=")[1];
        }

        // 利用惰性函数避免每次都重新生成params对象
        getUrlQuery = function (name) {
            return params[name.toLowerCase()] || "";
        }
        return params[name.toLowerCase()] || "";
    },

    /**
     * 获取图片物理尺寸
     * @param  {string}   url      图片地址
     * @param  {Function} callback 回调方法
     * @return {array}             宽高组成的数据
     */
    getImageSize: function(url, callback) {
        if (!url) return;
        var img = new Image();
        img.src = url;

        function _return() {
            if (typeof (callback) === "function") {
                callback(img.Width, img.Height);
            }
            return [img.Width, img.Height];
        }

        var check = function () {
            if (img.Width > 0 || img.Height > 0) {
                clearInterval(timer);
                _return();
            }
        }

        var timer = setInterval(check, 40);

        img.onload = function () {
            _return();
        }
    },

    /**
     * 图片上传预览
     * @param  {DOM} input 上传控件
     * @param  {DOM} img   预览控件
     * @return {   }
     */
    previewImage: function(input, img) {
        if (window.FileReader) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.src = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        } else {
            img.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = input.value();
        }
    },

    // 简单的Cookie操作
    docCookies: {
        getItem: function (sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        }
    },

    /***
     *列表加载进度条
     */
    //给父元素添加 J-ProgressBarParent 样式名
    //给要显示的块添加J-ProgressBarShowEle样式名
    progressBar :{
        elP: $('.J-ProgressBarParent'),
        showProgressBar: function (_style, _type) {//_style：过渡动画颜色样式，_type：过渡动画样式1：滚动条、2：转动圈圈

            if (this.elP.find('.J-ProgressBar').length) return;

            _style = _style || 'info';
            _type = _type || 1;

            var $el = this.elP.find('.J-ProgressBarShowEle');

            var minHeight = _type == 1 ? '112px' : '300px';
            var ProgressBarStr = _type == 1 ?
            '<div class="J-ProgressBar">' +
                '<div class="ibox-content" style="border: 0">' +
                    '<div class="progress progress-striped active">' +
                        '<div style="width: 100%" role="progressbar" class="progress-bar progress-bar-' + _style + '"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' :
            '<div class="J-ProgressBar progress-circle">' +
                '<div class="sk-spinner sk-spinner-chasing-dots">' +
                    '<div class="sk-dot1"></div><div class="sk-dot2"></div>' +
                '</div>' +
            '</div>';

            $el.addClass('progress-bar-show-ele');
            this.elP.css('min-height', minHeight)
            .prepend(ProgressBarStr);
        },
        removeProgressBar: function () {
            var $el = this.elP.find('.J-ProgressBarShowEle');
            $('.J-ProgressBar').fadeOut(500, function () {
                $(this).remove();
                $el.removeClass('progress-bar-show-ele');
                $el.fadeIn();
            });
        }
    },

    //intro js start
    //is LS or not
    needIntro: function (_fnReady,_fnComplete) {

    },

    // echart跳转
    ECJump: function (_url,_data) {
        var arr_href = _url.split('/');
        var pageName = arr_href[arr_href.length - 2] + arr_href[arr_href.length - 1];
        localStorage.setItem(pageName + '_data', _data);
        top.location.href = webroot + '#' + _url;
    },

    // 悬浮提示框
    tooltip: function () {
        var self = this;
        var $el = $('[data-toggle="tooltip"]');

        $el.tooltip({
            html: true
        });
        $('body').on('click', 'a[data-toggle="tooltip"][target="_blank"]', function(e){
            $(this).blur();
        });
    },
    toastr: {
        setOption: function(){
            /***
             *jquery通知插件toastr
             */
            toastr.options = {
                "closeButton": false,//是否显示关闭按钮
                "debug": false,//调试信息
                "positionClass": "toast-top-center",//显示位置
                "onclick": null,//是否允许点击事件
                "showDuration": "300",//显示事件
                "hideDuration": "300",//隐藏时间
                "timeOut": "1500",//持续时间
                "extendedTimeOut": "500",//延时
                "showEasing": "swing",//出现样式
                "hideEasing": "linear",//消失样式
                "showMethod": "fadeIn",//是否淡入
                "hideMethod": "fadeOut",//是否淡出
                "preventDuplicates": true//不重复显示
            };
        },
        request: function (_re,_fn1,_fn2){//_fn1成功执行方法,_fn2失败的方法
            if(_re.status == 1){
                toastr.success(_re.msg);
                if (_fn1) _fn1();
            }else{
                toastr.error(_re.msg);
                if (_fn2) _fn2();
            }
        }
    }
};

commonMethods.init();