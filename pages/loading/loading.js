import { getHardversionByCode } from '/require/charge-api'
Page({
  data: {
    isClodeMiniPro: false, //是否显示关闭小程序弹框
  },
  onLoad(options) {
    my.hideBackHome();
    my.setNavigationBar({
      title: '正在加载'
    })
    // my.getAuthCode({
    //   scopes: ['auth_base'],
    //   success: (res) => {
    //      console.log(res)
    //     my.alert({
    //       content: res.authCode,
    //     });
    //   },
    // });
    this.handleInit(options.code)
  },
  //初始化数据
  async handleInit(code){
    console.log(code)
    try{
       let info= await getHardversionByCode({code})
       let url= ''
       if(info.code === 200){
         if( ['00','01','02','05','06','07'].includes(info.hardversion) ) {
           url= `/pages/changepage/chargeport/chargeport?code=${code}`
         }else{ //拦截
           return my.alert({
             title: '提示',
             content: '暂不支持此类型设备',
           });
         }
        
       }else{ // 查询失败 / 设备离线 / 设备过期 / 设备IMEI号过期 / 设备未绑定
          // this.toggleCloseMiniPro(true)
          url= `/pages/changepage/chargeerror/chargeerror?code=${code}`
       }
      my.reLaunch({
        url
      });
    }catch(e){
      this.toggleCloseMiniPro(true)
    }
  },
  // 切换关闭小程序弹框
  toggleCloseMiniPro(flag){  // true 显示关闭小程序，false隐藏关闭小程序
    this.setData({
      isClodeMiniPro: flag
    })
    this.closeMiniPro.setData({
      isshow: flag
    })
  },
  // 获取小程序实例
  getCloseMiniPro(ref){
    this.closeMiniPro= ref
  }
});
