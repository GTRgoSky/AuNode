window.onload = function(){
    console.log(ipFlag, commonInfo.ip);

    if(ipFlag != 1){
        openFrame();
    }

    function openFrame(){
        layer.confirm(
            '姓名：' +  commonInfo.UserName +
            '<br />' +
            '工号：' +  commonInfo.JobNumber +
            '<br />' +
            'IP：' +  commonInfo.ip +
            '<p class="text-danger">若非本人登录本机操作，请无视此警告！</p>',
            {
                icon: 0,
                title: '是否' + (ipFlag == 2 ? '更新' : '新增') + 'IP'
            }, function () {
                console.log(1234);
                $.ajax({
                    url: '/home/UpdateIp?flag=' + ipFlag + '&ip=' + commonInfo.ip + '&name=' + commonInfo.UserName + '&num=' + commonInfo.JobNumber,
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
    }

    $('.J-Update').click(openFrame);
};