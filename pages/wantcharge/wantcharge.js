import { checkURL } from '/utils'
const app= getApp()
const BASE_URL= app.globalData.BASE_URL
Page({
  data: {
    cardid: '' //测试在线卡
  },
  onLoad() {},
  // 点击扫描二维码
  handleScan(){
    my.scan({
      scanType: ['qrCode','barCode'],
      success: (res) => {
        this.handleScanResult(res.code)
      },
      error: err=>{
        console.log(err)
      }
    });
  },
  //扫码跳转到编号充电
  handleScanResult(url){
    const resObj= checkURL(BASE_URL,url)
    console.log(resObj,url)
    if(resObj.status === 200 && resObj.type === 1){
      my.reLaunch({
        url: `/pages/loading/loading?code=${resObj.code}`
      });
    }else if(resObj.status === 200 && resObj.type === 2){
      my.reLaunch({
        url: `/pages/loading/loading?code=${resObj.codeAndPort}`
      });
    }else{
      my.alert({
        title: '提示',
        content: `${resObj.status === 400 ? '地址' : '设备号'}错误`
      });
    }
    
  },
  handleGo(){
    my.navigateTo({
      url: '/pages/wantcharge/pages/numtocharge/numtocharge'
    });
  },
  handlego(){
    my.reLaunch({
      url: '/pages/changepage/chargeport/chargeport'
    })
  },
  // 测试在线卡
  handleChange(e){
    this.setData({
      cardid: e.detail.value
    })
  },
  testOnlineCard(){
    my.reLaunch({
      url: `/pages/rechargepage/rechargeonlinecard/rechargeonlinecard?cardNumber=${this.data.cardid}`
    });
  }
});
