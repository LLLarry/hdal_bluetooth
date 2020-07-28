import { getHardversionByCode } from '/require/charge-api'
import { checkURL } from '/utils'
const app= getApp()
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
    if(options.code){ //从里面输入设备号进来
      this.handleInit(options.code)
    }else{ //从外面扫码进来
      this.handleReturnVal()
    }
  },
  // 处理初始化返回值（扫码跳进来）
  handleReturnVal(){
    const query= JSON.parse(app.globalData.query)
    if(query && query.qrCode){
      const url= query.qrCode
      let checkDevice= checkURL(app.globalData.BASE_URL,url)
      if(checkDevice.status === 200){
         if(checkDevice.type === 1){ //跳进设备
            this.handleInit(checkDevice.code)
         }else{ //跳进在线卡
             my.reLaunch({
                url: `/pages/rechargepage/rechargeonlinecard/rechargeonlinecard?cardNumber=${checkDevice.cardNumber}`
             });
         }
      }else if(checkDevice.status === 201){ //在线卡号/设备号错误
          my.reLaunch({
              url: `/pages/unusualpage/keyerror/keyerror?status=${checkDevice.status}&type=${checkDevice.type}`
          });
      }else{ //地址有误
          my.reLaunch({
              url: `/pages/unusualpage/keyerror/keyerror?status=${checkDevice.status}`
          });
      }
    }
  },
  //初始化数据
  async handleInit(code){
    console.log(code)
    try{
       let info= await getHardversionByCode({code})
       let url= ''
       if(info.code === 200){
         if( ['00','01','02','05','06','07'].includes(info.hardversion) ) { //扫描设备号，或在小程序内部输入设备号进去充电
           url= `/pages/changepage/chargeport/chargeport?code=${info.equipmentnum}`
           if(typeof info.port !== 'undefined'){ //扫描端口号进来
             url= `/pages/changepage/chargebyport/chargebyport?code=${code}`
           }
         }else if( ['03'].includes(info.hardversion) ) { //扫描设备号，或在小程序内部输入设备号进去充电 (脉冲)
           url= `/pages/changepage/chargeicon/chargeicon?code=${info.equipmentnum}`
         }else if( ['04'].includes(info.hardversion) ) { //扫描设备号，或在小程序内部输入设备号进去充电 （离线充值机）
           url= `/pages/rechargepage/rechargeoffline/rechargeoffline?code=${info.equipmentnum}`
         }else{ //拦截 暂不支持的设备
           url= `/pages/changepage/chargenosupport/chargenosupport`
         }
        
       }else{ // 查询失败 / 设备离线 / 设备过期 / 设备IMEI号过期 / 设备未绑定
          url= `/pages/changepage/chargeerror/chargeerror?code=${info.equipmentnum}&statuscode=${info.code}&result=${JSON.stringify(info.res_data)}`
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
