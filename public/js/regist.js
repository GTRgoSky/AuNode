

$().ready(function() {
// 在键盘按下并释放及提交后验证提交表单
  $("#userRegist").validate({
    rules: {
      UserName: {
        required:true,
        minlength:4
      },
      UserPassWord: {
        required: true,
        minlength: 6
      },
      SurePass: {
        required: true,
        minlength: 6,
        equalTo: ".J-UserPassWord"
      },
      agree: "required"
    },
    messages: {
      UserName: {
        required:"请输入用户名",
        minlength:"用户名长度不能小于 6 个字母",
      },
      UserPassWord: {
        required: "请输入密码",
        minlength: "密码长度不能小于 6 个字母"
      },
      SurePass: {
        required: "请输入确认密码",
        minlength: "密码长度不能小于 6 个字母",
        equalTo: "两次密码输入不一致"
      },
      agree: "请接受我们的声明",
    },
    onsubmit:true,
    onkeyup:false,
    onfocusout:false,
    showErrors:function(errorMap,errorList) {
      var self = this ;
      if(errorList.length > 0){
        toastr.warning(self.errorList[0].message)
      }
    },
  })
});