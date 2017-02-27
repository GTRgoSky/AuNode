/*==========================
 * 表单验证
 * @param
 * @return
 */
//电话验证
$.validator.addMethod('phone', function(value, element) {
    var length = value.length;
    return this.optional(element) || (/^[1][358][0-9]{9}$/.test(value));
},'请输入正确的手机号');

$.extend($.validator.messages, {
    number: '请输入合法的数字',
    required: '该项必须填写',
    email: 'E-Mail格式不正确',
    url: '请输入合法的网址',
    digits: '只能输入整数',
    maxlength: $.validator.format('最长可输入 {0} 个字符'),
    minlength: $.validator.format('最少需要输入 {0} 个字符'),
    rangelength: $.validator.format('请输入 {0} 到 {1} 个字符'),
    range: $.validator.format('请输入一个介于 {0} 和 {1} 之间的值'),
    max: $.validator.format('请输入一个最大为 {0} 的值'),
    min: $.validator.format('请输入一个最小为 {0} 的值')
});

window.JQvalidate = function(params){
    var defaultSetting = {
        el: $('.J-ValidateForm'),
        debug: true,
        onkeyup: false,
        onfocusout: false,
        onclick: false,
        rules: {
            password2: {
                required: true,
                equalTo: '#password'
            }
        },
        messages: {
            password2: {
                required: '请输入密码',
                equalTo: '两次密码不一致，请重新输入'
            }
        },
        errorElement: 'strong',
        errorClass:'error',
        // 提交的一些事件
        submitHandler: function(form){
            $(form).subimt();
        },
        // Append error within linked label
        errorPlacement: function(error, element) { //错误信息位置设置方法
            error.appendTo(element.closest('.form-group').find('.J-validate-msg')); //这里的element是录入数据的对象
        },
        // 显示的当前错误信息
        showErrors: function(){},

        // 验证成功之后执行
        success: function(){
            return 'valid';
        }
    };

    // 参数配置（混合）
    var option = $.extend(true, {}, defaultSetting, params || {});

    // 实例化
    option.el.validate({
        debug: option.debug,
        onkeyup: option.onkeyup,
        onfocusout: option.onfocusout,
        onclick: option.onclick,
        rules: option.rules,
        messages: option.messages,
        errorElement: option.errorElement,
        errorClass: option.errorClass,
        submitHandler: function(form){
            option.submitHandler(form);
        },
        errorPlacement: function(error, element){
            option.errorPlacement(error, element);
        },
        showErrors: function(errorMap,errorList){
            this.numberOfInvalids();
            this.defaultShowErrors();
            option.showErrors(errorMap,errorList);
        },
        success: function(errorElement, element){
            option.success(errorElement, element);
        }
        // highlight: function(element) { // hightlight error inputs
        //     $(element).closest('.form-group').addClass('has-error'); // set error class to the control group
        // },
        // unhighlight: function(element) { // revert the change done by hightlight
        //     $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
        // },
        // success: function(label) {
        //     label.closest('.form-group').removeClass('has-error'); // set success class to the control group
        // }
    });
};