import { deviceCharge,getTradeNoFormScancharge,getPortStatusByPort } from '/require/charge-api'
import { compatibleCloseMiniPro,asyGetUserId } from '/utils/index'
import pay from '/utils/pay'
const app= getApp()
let getOptions= null
Page({
  data: {
    code: '', //设备号
    paytypeShow: true, //支付方式弹出层
    chargeInfoShow: false, //充电信息弹框
    selectPort: '', //默认选中端口
    defaultIndex: 1, //默认选中索引
    paytype: 1, //支付方式 1、支付宝 2、钱包  3、包月  如果ifwallet == 1 时 paytype = 2
    result: null,
    tipMessage: '异常信息'
  },
  onLoad(options) {
    getOptions= options
  },
  onReady(){
    setTimeout(() => {
      // my.hideBackHome();
      const code= getOptions.code.substr(0,6)
      const selectPort= getOptions.code.substr(6)
        this.setData({
        code,
        selectPort
      })
      this.handleInit(getOptions.code)
    });
  },
  async handleInit(code){
    try{
      let info=  await deviceCharge({code: code})
      if(info.code === 200){
        this.setData({
          defaultIndex: info.defaultindex,
          result: info
        })
        if(info.brandname){
          my.setNavigationBar({
            title: info.brandname
          })
        }
        // 获取端口状态
        this.handleChangePortStatus()
      }else{
        // this.closeMiniPro.setData({isshow: true})
        compatibleCloseMiniPro.call(this)
      }
    }catch(e){
      console.log(e)
      // this.closeMiniPro.setData({isshow: true})
      compatibleCloseMiniPro.call(this)
    }
  },
  // 修改端口状态
  async handleChangePortStatus(){
    try{
      let info= await getPortStatusByPort({code: this.data.code,port: this.data.selectPort,nowtime: this.data.result.nowtime})
      if(info.state == 'error'){
        // this.setData({
        //   tipMessage: '连接失败，请确认设备是否在线'
        // })
        // this.closeMiniPro.setData({isshow: true})
        compatibleCloseMiniPro.call(this,'连接失败，请确认设备是否在线')
      }else if(info.portstatus != '空闲'){
        // this.setData({
        //   tipMessage: '此端口不可用'
        // })
        // this.closeMiniPro.setData({isshow: true})
        compatibleCloseMiniPro.call(this,'此端口不可用')
      }
    }catch(err){
      // this.setData({
      //   tipMessage: '端口状态获取出错'
      // })
      // this.closeMiniPro.setData({isshow: true})
      compatibleCloseMiniPro.call(this,'端口状态获取出错')
    }
  },
  // 关掉支付方式弹出层
  onPopupClose(){
    this.setData({
      paytypeShow: false,
      chargeInfoShow: true
    })
  },
  // 关闭充电信息弹框
  handleCloseChargeInfo(){
    this.setData({
      chargeInfoShow: false,
      paytypeShow: true
    })
  },
    // 打开充电信息弹框
  handleOpenChargeInfo(){
    this.setData({
      chargeInfoShow: true,
      paytypeShow: false
    })
  },
  // 设置选中端口号
  handleSetSelectPort(port){
    this.setData({
      selectPort: port,
      paytypeShow: true
    })
  },
  // 设置选中模板
  handleSelectTem(index){
    this.setData({
      defaultIndex: index
    })
  },
  //设置支付方式
  handleSetPayType(paytype){
    this.setData({
      paytype
    })
  },
  //获取 关闭小程序弹框实例
  handleGetCloseMini(ref){
    this.closeMiniPro= ref
  },
  // 点击开始充电按钮
  async handleSubmit(){
    let userid= app.globalData.userid
    if(!userid){
      userid= await asyGetUserId(app)
    }
    const checkList= [
      {
        check: !!userid,
        content: '未获取到用户id'
      },
      {
        check: this.data.selectPort,
        content: '未选择端口号'
      },
      {
        check: this.data.result.templatelist.length > 0,
        content: '模板数据为空'
      },
    ]
    pay.call(this,checkList,()=>(
      getTradeNoFormScancharge({
          userid,
          code: this.data.code,
          tempid: this.data.result.templatelist[this.data.defaultIndex].id,
          param: this.data.selectPort,
          hardversion: '01'
        })
    ))
  }
});
