import { deviceCharge,getTradeNoFormScancharge,getPortStatus } from '/require/charge-api'
import { compatibleCloseMiniPro,asyGetUserId } from '/utils/index'
import pay from '/utils/pay'
const app= getApp()
let getOptions= null
Page({
  data: {
    code: '', //设备号
    paytypeShow: false, //支付方式弹出层
    chargeInfoShow: false, //充电信息弹框
    selectPort: null, //默认选中端口
    defaultIndex: 1, //默认选中模板索引
    paytype: 1, //支付方式 1、支付宝 2、钱包  3、包月  如果ifwallet == 1 时 paytype = 2
    result: null,
    tipMessage: '异常信息'
  },
  onLoad(options) {
    getOptions= options
  },
  onReady(){
       setTimeout(() => {
          this.setData({
            code: getOptions.code
          })
          this.handleInit(getOptions.code)
       });
    },
    // 初始化获取数据
    async handleInit(code){
      try{
        let info=  await deviceCharge({code})
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
          this.handleChangePortStatus() //查询端口状态
        }else{
          compatibleCloseMiniPro.call(this)
        }
      }catch(e){
        compatibleCloseMiniPro.call(this)
      }
    },
  // 关掉支付方式弹出层
    onPopupClose(){
      this.setData({
        paytypeShow: false
      })
    },
    // 关闭充电信息弹框
    handleCloseChargeInfo(){
      this.setData({
        chargeInfoShow: false
      })
    },
      // 打开充电信息弹框
    handleOpenChargeInfo(){
      this.setData({
        chargeInfoShow: true
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
          check: this.data.result && this.data.result.templatelist.length > 0,
          content: '模板数据为空'
        }
      ]
      pay.call(this,checkList,()=>{
        return getTradeNoFormScancharge({
          userid,
          code: this.data.code,
          tempid: this.data.result.templatelist[this.data.defaultIndex].id,
          param: this.data.selectPort,
          hardversion: '08'
        })
      })
    },
  // 修改端口状态
  async handleChangePortStatus(){
    try{
        let poststatus= await getPortStatus({code: this.data.code,nowtime: this.data.result.nowtime})
        if(poststatus.state === 'error'){
          compatibleCloseMiniPro.call(this,'连接失败，请确认设备是否在线')
        }else{
          const portList= this.data.result.portList
          for(let key in poststatus){
            if(key=="param1"||key=="param2"||key=="param3"||key=="param4"||key=="param5"||key=="param6"||key=="param7"||key=="param8"||key=="param9"||key=="param10"||key=="param11"||key=="param12"||key=="param13"||key=="param14"||key=="param15"||key=="param16"||key=="param17"||key=="param18"||key=="param19"||key=="param20"){
              const portNum= key.match(/\d+/g)[0]-1
              switch(poststatus[key]){
                case '空闲':
                    portList[portNum].portStatus= 1
                    break;
                case '使用':
                    portList[portNum].portStatus= 2
                    break;
                default: 
                  portList[portNum].portStatus= 4
              }
              this.setData({
                'result.portList': portList
              })
            }
          }
        }
    }catch(err){
      // this.setData({
      //   tipMessage: '端口状态获取出错'
      // })
      // this.closeMiniPro.setData({isshow: true})
      compatibleCloseMiniPro.call(this,'端口状态获取出错')
    }
  },
});
