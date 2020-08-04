import { getUserid } from '/require/home'
const updateManager = my.getUpdateManager()
App({
  globalData: {
     userid: '', //用户id
     query: null , //扫码获取传递过来的参数
     BASE_URL: 'http://www.he360', //扫码二维码基础路径
  },
  onLaunch(options) {
    this.handleUpdate()
    if(options.scene == '1011'){ //扫码进来的
        const bluetooth_baseurl= 'https://www.tengfuchong.cn/applet/'
        if(options.query && options.query.qrCode.indexOf(bluetooth_baseurl) != -1){
          my.setStorageSync({
            key: 'scanUrl', // 缓存数据的key
            data: options.query.qrCode, // 要缓存的数据
          });
        }else{
          this.globalData.query= JSON.stringify(options.query)
        }
    }
    //  this.globalData.query= JSON.stringify({qrCode: "http://www.tengfuchong.com.cn/oauth2pay?code=0000011"})
    //  this.globalData.query= JSON.stringify({qrCode: "http://www.tengfuchong.com.cn/oauth2online?cardNumber=0Baa4f31"})
    this.handleGetUserId()
  },
  handleGetUserId(){
    my.getAuthCode({
      scopes: ['auth_base'],
      success: async (res) => {
        let info= await getUserid({authCode: res.authCode})
        if(info.code === 200){
          this.globalData.userid= info.userid
        }
      },
    });
  },
  handleUpdate(){
    updateManager.onUpdateReady(function () {
      my.confirm({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

  }
});
