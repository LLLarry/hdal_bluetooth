Page({
  data: {
    code: '', //设备号
    statuscode: '', //状态码
    res_info: {}, //错误信息
    resove_type: {
      '2001': ['设备供电异常','设备网络异常'], //离线
      '2002': ['请联系商户进行绑定'], //未绑定
      '2003': ['请联系商户进行续费'], //设备已到期
      '2004': ['请联系商户进行检测'], //设备号传递不正确
    }
  },
  onLoad(options) {
    my.hideBackHome();
    this.setData({
      code: options.code,
      statuscode: options.statuscode,
      statuscode: options.statuscode,
      res_info: options.result === 'undefined' ? {} : JSON.parse(options.result)
    })
  },
});
