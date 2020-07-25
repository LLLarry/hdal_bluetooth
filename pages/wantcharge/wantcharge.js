Page({
  data: {},
  onLoad() {},
  // 点击扫描二维码
  handleScan(){
    my.scan({
      scanType: ['qrCode','barCode'],
      success: (res) => {
        my.alert({ title: res.code });
      },
    });
  },
  //跳转到编号充电
  handleGo(){
    my.navigateTo({
      url: '/pages/wantcharge/pages/numtocharge/numtocharge'
    });
  },
  handlego(){
    my.reLaunch({
      url: '/pages/changepage/chargeport/chargeport'
    })
  }
});
