App({
  globalData: {
     query: null , //扫码获取传递过来的参数
     BASE_URL: 'http://www.tengfuchong.com.cn', //扫码二维码基础路径
  },
  onLaunch(options) {
    // if(options.scene === 1011){ //扫码进来的
    //     this.globalData.query= JSON.stringify(options.query)
    // }
     this.globalData.query= JSON.stringify({qrCode: "http://www.tengfuchong.com.cn/oauth2pay?code=0000011"})
    //  this.globalData.query= JSON.stringify({qrCode: "http://www.tengfuchong.com.cn/oauth2online?cardNumber=0Baa4f31"})
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}{
      //   "pagePath": "pages/nowCharge/nowCharge",
      //   "name": "正在充电",
      //   "icon": "assets/tabBar/wallet.png",
      //   "activeIcon": "assets/tabBar/wallet-active.png"
      // },
      // {
      //   "pagePath": "pages/my/my",
      //   "name": "我的",
      //   "icon": "assets/tabBar/my.png",
      //   "activeIcon": "assets/tabBar/my-active.png"
      // }

    // "pages/my/my",
    // "pages/index/index",
    // "pages/wallet/wallet",
    // "pages/chargelist/chargelist",
    // "pages/chargelistdetail/chargelistdetail",
    // "pages/wantcharge/wantcharge",
    // "pages/wantcharge/pages/numtocharge/numtocharge",
    // "pages/nowCharge/nowCharge",
    // "pages/changepage/chargeport/chargeport",
    // "pages/changepage/chargebyport/chargebyport",
    // "pages/loading/loading",
    // "pages/changepage/chargeicon/chargeicon",
    // "pages/rechargepage/rechargeoffline/rechargeoffline",
    // "pages/rechargepage/rechargeonlinecard/rechargeonlinecard",
    // "pages/changepage/chargeerror/chargeerror",
    // "pages/changepage/chargenosupport/chargenosupport"
  },
});
