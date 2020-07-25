App({
  globalData: {
     scanCode: '' , //扫码获取的设备号
  },
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch',options);
    this.globalData.scanCode= '000002'
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
