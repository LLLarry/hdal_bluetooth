import { deviceCharge,getTradeNoFormchargeport } from '/require/charge-api'
const app= getApp()
let getOptions= null
let isPaying= false //是否正在支付
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
        }else{
          this.closeMiniPro.setData({isshow: true})
        }
      }catch(e){
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
    async handleSubmit(){
      try{
        if(isPaying) return //不能重复提交
        const userid= app.globalData.userid
        if(!userid){
          return  my.alert({
            title: '提示',
            content: '未获取到用户id'
          })
        }
        if(!this.data.selectPort){
          return  my.alert({
            title: '提示',
            content: '未选择端口号'
          })
        }
        if(this.data.result.templatelist.length <= 0){
          return  my.alert({
            title: '提示',
            content: '模板数据为空'
          })
        }
        isPaying= true
        let info= await getTradeNoFormchargeport({
          userid,
          code: this.data.code,
          port: this.data.selectPort,
          tempid: this.data.result.templatelist[this.data.defaultIndex].id
        })
        if(info.code === 200){
          my.tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            tradeNO: info.trade_no,
            success: (res) => {
              if(res.resultCode == 9000){
                  this.setData({
                    tipMessage: '支付成功'
                  })
                  this.closeMiniPro.setData({isshow: true})
              }else if(res.resultCode == 6001){
                my.alert({
                  title: '提示',
                  content: res.memo
                })
                isPaying= false
              }
            },
            fail: (res) => {
              this.setData({
                tipMessage: '调用失败'
              })
              this.closeMiniPro.setData({isshow: true});
            }
          });
        }else{
          my.alert({
            title: '提示',
            content: info.message
          })
          isPaying= false
        }
      }catch(err){
        this.setData({
          tipMessage: '支付异常'
        })
        this.closeMiniPro.setData({isshow: true})
      }
    }
  });
