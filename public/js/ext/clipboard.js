// 点击按钮复制网页链接
; (function () {
    var clipboard = new Clipboard('.J-Copy');
    clipboard.on('success', function (e) {
        if (toastr) {
            toastr.success('复制成功！');
        } else {
            alert('复制成功！');
        }
    });
    clipboard.on('error', function (e) {
        if (toastr) {
            toastr.warning('复制失败！');
        } else {
            alert('复制失败！');
        }
    });
})();
