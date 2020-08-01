import { deviceCharge,getOfflinedeviceToCradID,getTradeNoFormScancharge } from '/require/charge-api'
import pay from '/utils/pay';
const app= getApp()
let getOptions= null
Page({
  data: {
    code: '', //设备号
    cardID: '', //离线卡号
    balance: 0,//卡余额
    defaultIndex: 0, //默认索引
    temList: [],
    phonenum: '',
    tipMessage: '获取数据异常', //提示信息
    nowtime: '', //服务器时间
  },
  onLoad(options) {
    getOptions= options
  },
  onReady(){
    setTimeout(()=>{
      my.hideBackHome();
      this.setData({
        code: getOptions.code
      })
      this.handleInit(getOptions.code)
    },300)
  },
  // 获取设备上的充电卡
  async handleGetCardID(code){
    try {
      let info= await getOfflinedeviceToCradID({code,openid: '',nowtime: this.data.nowtime})
      if(info.result == 0){ //获取卡号成功
        this.setData({
          cardID: info.card_id,
          balance: info.card_surp / 10
        })
        // this.handleInit(code)
      }else if(info.result == 2){
          this.setData({
            tipMessage: '未获取到离线卡'
          })
          return this.closeMiniPro.setData({isshow: true})
      }else{ //获取失败
          this.setData({
            tipMessage: info.errinfo
          })
          return this.closeMiniPro.setData({isshow: true})
      }
      my.hideLoading()
    }catch(err){
       my.hideLoading()
        this.setData({
          tipMessage: '异常出错'
        })
        return this.closeMiniPro.setData({isshow: true})
    }
  },
  // 初始化数据
  async handleInit(code){
    try{
      let info= await deviceCharge({code})
      if(info.code === 200){ //成功
        this.setData({
          defaultIndex: info.defaultindex,
          temList: info.templatelist,
          phonenum: info.phonenum,
          nowtime: info.nowtime
        })
        //设置品牌名称
        if(info.brandname){
          my.setNavigationBar({
            title: info.brandname
          })
        }
        this.handleGetCardID(this.data.code)
      }else{ //失败
         this.closeMiniPro.setData({isshow: true})
      }
    }catch(e){ //出错
      this.closeMiniPro.setData({isshow: true})
    }
  },
  // 选择模板
  selectTem(item,index){
    this.setData({
      defaultIndex: index
    })
  },
   //获取 关闭小程序弹框实例
  handleGetCloseMini(ref){
     this.closeMiniPro= ref
  },
  // 开始充值
  handleSubmit(){
    const userid= app.globalData.userid
    const checkList= [
      {
        check: !!userid,
        content: '为获取到用户id',
      },
      {
        check: this.data.temList.length > 0,
        content: '模板数据为空',
      },
      {
        check: !!this.data.cardID,
        content: '未获取到离线卡号',
      },
    ]
    pay.call(this,checkList,()=>(
      getTradeNoFormScancharge({
       userid,
       code: this.data.code,
       tempid: this.data.temList[this.data.defaultIndex].id,
       param: this.data.cardID, //离线充值机的卡号
       hardversion: '04'
      })
    ))
  }
});
