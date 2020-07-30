import { deviceCharge,getTradeNoFormScancharge,getPortStatus } from '/require/charge-api'
import pay from '/utils/pay'
const app= getApp()
let getOptions= null
// let this.isPaying= false //是否正在支付
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
      getOptions= options;
    },
    onReady(){
        my.hideBackHome();
        this.setData({
          code: getOptions.code
        })
        this.handleInit(getOptions.code)
        
    },
    // 初始化获取数据
    async handleInit(code){
      try{
        let info=  await deviceCharge({code})
        console.log('info',info)
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
          this.closeMiniPro.setData({isshow: true})
        }
      }catch(e){
        this.closeMiniPro.setData({isshow: true})
      }
    },
    // 修改端口状态
    async handleChangePortStatus(){
      try{
         let poststatus= await getPortStatus({code: this.data.code,nowtime: this.data.result.nowtime})
         if(poststatus.state === 'error'){
            this.setData({
              tipMessage: '连接失败，请确认设备是否在线'
            })
            this.closeMiniPro.setData({isshow: true})
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
        this.setData({
          tipMessage: '端口状态获取出错'
        })
        this.closeMiniPro.setData({isshow: true})
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
    handleSubmit(){
      const userid= app.globalData.userid
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
        }
      ]
      pay.call(this,checkList,()=>{
        return getTradeNoFormScancharge({
          userid,
          code: this.data.code,
          tempid: this.data.result.templatelist[this.data.defaultIndex].id,
          param: this.data.selectPort,
          hardversion: '01'
        })
        //  return getTradeNoFormchargeport({
        //       userid,
        //       code: this.data.code,
        //       port: this.data.selectPort,
        //       tempid: this.data.result.templatelist[this.data.defaultIndex].id
        //     })
      })
    }
    
    // 点击开始充电按钮
    // async handleSubmit(){
    //   try{
    //     if(this.isPaying) return //不能重复提交
    //     const userid= app.globalData.userid
    //     if(!userid){
    //       return  my.alert({
    //         title: '提示',
    //         content: '未获取到用户id'
    //       })
    //     }
    //     if(!this.data.selectPort){
    //       return  my.alert({
    //         title: '提示',
    //         content: '未选择端口号'
    //       })
    //     }
    //     if(this.data.result.templatelist.length <= 0){
    //       return  my.alert({
    //         title: '提示',
    //         content: '模板数据为空'
    //       })
    //     }
    //     this.isPaying= true
    //     let info= await getTradeNoFormchargeport({
    //       userid,
    //       code: this.data.code,
    //       port: this.data.selectPort,
    //       tempid: this.data.result.templatelist[this.data.defaultIndex].id
    //     })
    //     if(info.code === 200){
    //       my.tradePay({
    //         // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
    //         tradeNO: info.trade_no,
    //         success: (res) => {
    //           if(res.resultCode == 9000){
    //               this.setData({
    //                 tipMessage: '支付成功'
    //               })
    //               this.closeMiniPro.setData({isshow: true})
    //           }else if(res.resultCode == 6001){
    //             my.alert({
    //               title: '提示',
    //               content: res.memo
    //             })
    //             this.isPaying= false
    //           }
    //         },
    //         fail: (res) => {
    //           this.setData({
    //             tipMessage: '调用失败'
    //           })
    //           this.closeMiniPro.setData({isshow: true});
    //         }
    //       });
    //     }else{
    //       my.alert({
    //         title: '提示',
    //         content: info.message
    //       })
    //       this.isPaying= false
    //     }
    //   }catch(err){
    //     this.setData({
    //       tipMessage: '支付异常'
    //     })
    //     this.closeMiniPro.setData({isshow: true})
    //   }
    // }
  });
