import { getHardversionByCode } from '/require/charge-api'
// import { compatibleCloseMiniPro } from '/utils/index'
import { checkURL } from '/utils'
const app= getApp()
let getOptions= null
Page({
  data: {
    isClodeMiniPro: false, //是否显示关闭小程序弹框
  },
  onLoad(options) {
    getOptions= options
  },
  onReady(){
    setTimeout(()=>{ //在 onReady中加入延时，是为了解决扫码跳转之后出错无法跳出小程序的bug
      // my.hideBackHome();
      if(getOptions.code){ //从里面输入设备号进来
        if(getOptions.type == 4){ //跳进蓝牙设备loading
          this.handleGoBlueTooth(getOptions)
        }else{
          this.handleInit(getOptions.code)
        }
      }else{ //从外面扫码进来
        this.handleReturnVal()
      }
    })
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
         }else if(checkDevice.type === 2){ //跳进设备
            this.handleInit(checkDevice.codeAndPort)
         }else if(checkDevice.type === 3){ //跳进在线卡
             my.reLaunch({
                url: `/pages/rechargepage/rechargeonlinecard/rechargeonlinecard?cardNumber=${checkDevice.cardNumber}`
             });
         }else {
           my.alert({
             title: '提示',
             content: '异常错误！'
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
    try{
       let info= await getHardversionByCode({code})
       let url= ''
       if(info.code === 200){
         if( ['00','01','02','05','06','07'].indexOf(info.hardversion) != -1 ) { //扫描设备号，或在小程序内部输入设备号进去充电
           url= `/pages/changepage/chargeport/chargeport?code=${info.equipmentnum}`
           if(typeof info.port !== 'undefined'){ //扫描端口号进来
             url= `/pages/changepage/chargebyport/chargebyport?code=${code}`
           }
         }else if( ['03'].indexOf(info.hardversion) != -1 ) { //扫描设备号，或在小程序内部输入设备号进去充电 (脉冲)
           if(info.deviceType != 2){ //普通03设备
             url= `/pages/changepage/chargeicon/chargeicon?code=${info.equipmentnum}`
           }else{ //蓝牙03设备
              this.handleGoBlueTooth({code,port:'1'}) //蓝牙默认端口为1
           }
         }else if( ['04'].indexOf(info.hardversion) != -1 ) { //扫描设备号，或在小程序内部输入设备号进去充电 （离线充值机）
           url= `/pages/rechargepage/rechargeoffline/rechargeoffline?code=${info.equipmentnum}`
         }else if( ['08','09','10'].indexOf(info.hardversion) != -1 ) { //扫描设备号，V3设备
           url= `/pages/changepage/chargeportv3/chargeportv3?code=${info.equipmentnum}`
           if(typeof info.port !== 'undefined'){ //扫描端口号进来
             url= `/pages/changepage/chargebyportv3/chargebyportv3?code=${code}`
           }
         }else{ //拦截 暂不支持的设备
           url= `/pages/changepage/chargenosupport/chargenosupport`
         }
        
       }else{ // 查询失败 / 设备离线 / 设备过期 / 设备IMEI号过期 / 设备未绑定
          url= `/pages/changepage/chargeerror/chargeerror?code=${info.equipmentnum}&statuscode=${info.code}&result=${JSON.stringify(info.res_data)}`
          //  if(['08'].indexOf(info.hardversion) != -1 ){
          //     url= `/pages/changepage/chargenosupport/chargenosupport`
          //  }else{
          //    url= `/pages/changepage/chargeerror/chargeerror?code=${info.equipmentnum}&statuscode=${info.code}&result=${JSON.stringify(info.res_data)}`
          //  }
       }
      my.reLaunch({
        url
      });
    }catch(e){
      this.toggleCloseMiniPro(true)
    }
  },
  // 跳进蓝牙loading
  handleGoBlueTooth({code,port}){
    let systemType= '2'
    my.getSystemInfo({
      success: (res) => {
        if (res.platform == "iOS") {
            systemType= '1'
        }else if (res.platform == "Android") {
            systemType= '2'
        }
        my.reLaunch({
          url: `/pages/bluetooth/loading2/loading2?deviceCode=${code}&port=${port}&systemType=${systemType}`
        })
      },
      fail: (res) => {
        this.toggleCloseMiniPro(true)
      }
    })
  },
  // 切换关闭小程序弹框
  toggleCloseMiniPro(flag){  // true 显示关闭小程序，false隐藏关闭小程序
    this.setData({
      isClodeMiniPro: flag
    })
    this.closeMiniPro && this.closeMiniPro.setData({
      isshow: flag
    })
  },
  // 获取小程序实例
  getCloseMiniPro(ref){
    this.closeMiniPro= ref
  }
});
